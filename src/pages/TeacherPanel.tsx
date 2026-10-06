import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, TabButton, Badge, inputCls, btnPrimary, EmptyState, fmtDate, ConfirmDialog, useToast } from '../components/ui';
import type { MCQ } from '../types';

const OPTIONS = ['ক', 'খ', 'গ', 'ঘ'];

function ChapterPicker({ value, onChange }: {
  value: { classId: string; subjectId: string; chapterId: string };
  onChange: (v: { classId: string; subjectId: string; chapterId: string }) => void;
}) {
  const { db } = useApp();
  const subjects = db.subjects.filter((s) => s.classId === value.classId);
  const chapters = db.chapters.filter((c) => c.subjectId === value.subjectId);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select className={inputCls()} value={value.classId} onChange={(e) => onChange({ classId: e.target.value, subjectId: '', chapterId: '' })}>
        <option value="">Select Class…</option>
        {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.nameBn}</option>)}
      </select>
      <select className={inputCls()} value={value.subjectId} onChange={(e) => onChange({ ...value, subjectId: e.target.value, chapterId: '' })} disabled={!value.classId}>
        <option value="">Select Subject…</option>
        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <select className={inputCls()} value={value.chapterId} onChange={(e) => onChange({ ...value, chapterId: e.target.value })} disabled={!value.subjectId}>
        <option value="">Select Chapter…</option>
        {chapters.map((c) => <option key={c.id} value={c.id}>Ch {c.order}: {c.name}</option>)}
      </select>
    </div>
  );
}

function McqForm({ addQuestion }: { addQuestion: (q: Omit<MCQ, 'id'>) => void | Promise<void> }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [ok, setOk] = useState(false);

  const submit = async () => {
    if (!question.trim() || options.some((o) => !o.trim())) return;
    await addQuestion({ question: question.trim(), options: options.map((o) => o.trim()), correctIndex: correct, explanation: explanation.trim() || undefined });
    setQuestion(''); setOptions(['', '', '', '']); setCorrect(0); setExplanation('');
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <div className="space-y-3">
      <textarea className={inputCls()} rows={2} placeholder="প্রশ্ন লিখুন…" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCorrect(i)}
              title="সঠিক উত্তর নির্বাচন করুন"
              className={`h-9 w-9 shrink-0 rounded-lg text-sm font-bold transition ${
                correct === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {OPTIONS[i]}
            </button>
            <input className={inputCls()} placeholder={`Option ${OPTIONS[i]}`} value={o} onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))} />
          </div>
        ))}
      </div>
      <input className={inputCls()} placeholder="ব্যাখ্যা (optional)" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
      <div className="flex items-center gap-3">
        <button type="button" {...btnPrimary()} onClick={submit}>+ Add Question</button>
        {ok && <span className="text-sm font-semibold text-emerald-600">প্রশ্ন যোগ হয়েছে ✓</span>}
        <span className="text-xs text-slate-400">সঠিক উত্তর চিহ্নিত করতে বাঁয়ের বাটনে (ক/খ/গ/ঘ) ক্লিক করুন</span>
      </div>
    </div>
  );
}

export default function TeacherPanel() {
  const { db, mutate, user } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<'content' | 'mcq' | 'weekly' | 'results'>('content');
  const [confirmState, setConfirmState] = useState<{ title: string; message: string; action: () => void } | null>(null);

  const askDelete = (title: string, message: string, action: () => void) => setConfirmState({ title, message, action });

  // content form
  const [pick, setPick] = useState({ classId: '', subjectId: '', chapterId: '' });
  const [ctype, setCtype] = useState<'lecture' | 'notes' | 'practice'>('lecture');
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('');

  // mcq tab
  const [mcqPick, setMcqPick] = useState({ classId: '', subjectId: '', chapterId: '' });

  // weekly tab
  const [wTitle, setWTitle] = useState('');
  const [wDuration, setWDuration] = useState(10);
  const [wPick, setWPick] = useState({ classId: '', subjectId: '', chapterId: '' });
  const [wExamId, setWExamId] = useState('');
  const [wFilter, setWFilter] = useState('all');

  const chapter = db.chapters.find((c) => c.id === pick.chapterId);
  const mcqChapter = db.chapters.find((c) => c.id === mcqPick.chapterId);
  const selectedExam = db.weeklyExams.find((e) => e.id === wExamId);

  const saveContent = async () => {
    if (!chapter) return;
    try {
      if (ctype === 'lecture') {
        if (!title.trim() || !videoUrl.trim()) return;
        await mutate(`/chapters/${chapter.id}/lectures`, 'POST', { title: title.trim(), videoUrl: videoUrl.trim() });
        toast('success', 'Lecture যোগ হয়েছে ✓');
      } else if (ctype === 'notes') {
        if (!title.trim() || !content.trim()) return;
        await mutate(`/chapters/${chapter.id}/notes`, 'POST', { title: title.trim(), content: content.trim() });
        toast('success', 'Notes যোগ হয়েছে ✓');
      } else {
        if (!content.trim() || !answer.trim()) return;
        await mutate(`/chapters/${chapter.id}/practice`, 'POST', { question: content.trim(), answer: answer.trim() });
        toast('success', 'Practice Question যোগ হয়েছে ✓');
      }
      setTitle(''); setVideoUrl(''); setContent(''); setAnswer('');
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  const allResults = [...db.results].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionTitle
        title="Teacher Panel"
        sub={`স্বাগতম, ${user?.name} — কনটেন্ট ও পরীক্ষা ব্যবস্থাপনা`}
        action={<Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:underline">← Dashboard</Link>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton active={tab === 'content'} onClick={() => setTab('content')}>Add Lecture / Notes / Practice</TabButton>
        <TabButton active={tab === 'mcq'} onClick={() => setTab('mcq')}>MCQ Builder</TabButton>
        <TabButton active={tab === 'weekly'} onClick={() => setTab('weekly')}>Weekly Exam</TabButton>
        <TabButton active={tab === 'results'} onClick={() => setTab('results')}>Student Results</TabButton>
      </div>

      <ConfirmDialog
        open={!!confirmState}
        onClose={() => setConfirmState(null)}
        onConfirm={() => confirmState?.action()}
        title={confirmState?.title ?? ''}
        message={confirmState?.message ?? ''}
      />

      {tab === 'content' && (
        <Card className="space-y-5 p-6">
          <ChapterPicker value={pick} onChange={setPick} />
          <div className="flex flex-wrap gap-2">
            {(['lecture', 'notes', 'practice'] as const).map((t) => (
              <TabButton key={t} active={ctype === t} onClick={() => setCtype(t)}>
                {t === 'lecture' ? 'Lecture / Video' : t === 'notes' ? 'Notes' : 'Practice Question'}
              </TabButton>
            ))}
          </div>
          {ctype === 'lecture' && (
            <>
              <input className={inputCls()} placeholder="Lecture Title (যেমন: গতি — ক্লাস ৯)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className={inputCls()} placeholder="YouTube Embed URL (যেমন: https://www.youtube.com/embed/…)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            </>
          )}
          {ctype === 'notes' && (
            <>
              <input className={inputCls()} placeholder="Notes Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea className={inputCls()} rows={6} placeholder="নোটের বিস্তারিত লেখা…" value={content} onChange={(e) => setContent(e.target.value)} />
            </>
          )}
          {ctype === 'practice' && (
            <>
              <textarea className={inputCls()} rows={2} placeholder="প্রশ্ন লিখুন…" value={content} onChange={(e) => setContent(e.target.value)} />
              <textarea className={inputCls()} rows={3} placeholder="উত্তর লিখুন…" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </>
          )}
          <button type="button" {...btnPrimary()} onClick={saveContent} disabled={!pick.chapterId}>Save →</button>

          {chapter && (
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <p className="text-sm font-bold text-slate-700">{chapter.name} — বর্তমান Content</p>
              {chapter.lectures.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lectures ({chapter.lectures.length})</p>
                  <div className="mt-1 space-y-1.5">
                    {chapter.lectures.map((l) => (
                      <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs ring-1 ring-slate-100">
                        <span className="font-medium text-slate-700">{l.title}</span>
                        <button onClick={() => askDelete('Lecture মুছবেন?', `"${l.title}" মুছে যাবে।`, () => mutate(`/lectures/${l.id}`, 'DELETE').catch((e) => toast('error', e.message)))} className="shrink-0 font-bold text-rose-500 hover:text-rose-700">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {chapter.notes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes ({chapter.notes.length})</p>
                  <div className="mt-1 space-y-1.5">
                    {chapter.notes.map((n) => (
                      <div key={n.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs ring-1 ring-slate-100">
                        <span className="font-medium text-slate-700">{n.title}</span>
                        <button onClick={() => askDelete('Notes মুছবেন?', `"${n.title}" মুছে যাবে।`, () => mutate(`/notes/${n.id}`, 'DELETE').catch((e) => toast('error', e.message)))} className="shrink-0 font-bold text-rose-500 hover:text-rose-700">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {chapter.practice.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice ({chapter.practice.length})</p>
                  <div className="mt-1 max-h-48 space-y-1.5 overflow-y-auto">
                    {chapter.practice.map((p) => (
                      <div key={p.id} className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs ring-1 ring-slate-100">
                        <span className="font-medium text-slate-700">{p.question.slice(0, 70)}{p.question.length > 70 ? '…' : ''}</span>
                        <button onClick={() => askDelete('Practice মুছবেন?', 'এই প্রশ্নটি মুছে যাবে।', () => mutate(`/practice/${p.id}`, 'DELETE').catch((e) => toast('error', e.message)))} className="shrink-0 font-bold text-rose-500 hover:text-rose-700">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!chapter.lectures.length && !chapter.practice.length && chapter.notes.length <= 1 && (
                <p className="text-xs text-slate-400">এই অধ্যায়ে এখনো বাড়তি কনটেন্ট নেই — উপরের ফর্ম থেকে যোগ করুন।</p>
              )}
            </div>
          )}
        </Card>
      )}

      {tab === 'mcq' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 p-6">
            <p className="font-bold text-slate-800">MCQ Builder — Chapter-এ প্রশ্ন যোগ করুন</p>
            <ChapterPicker value={mcqPick} onChange={setMcqPick} />
            {mcqChapter ? (
              <>
                <McqForm
                  addQuestion={async (m) => {
                    await mutate(`/chapters/${mcqChapter.id}/mcq`, 'POST', m);
                  }}
                />
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <label className="text-sm font-semibold text-slate-600">Test Duration (min):</label>
                  <input
                    type="number" min={1} className={`${inputCls()} w-24`}
                    defaultValue={mcqChapter.mcq.durationMin || mcqChapter.mcq.questions.length}
                    onBlur={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1);
                      e.target.value = String(v);
                      mutate(`/chapters/${mcqChapter.id}/duration`, 'PUT', { durationMin: v }).catch(() => {});
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Chapter নির্বাচন করুন।</p>
            )}
          </Card>

          <Card className="p-6">
            <p className="mb-3 font-bold text-slate-800">
              {mcqChapter ? `${mcqChapter.name} — বর্তমান প্রশ্ন (${mcqChapter.mcq.questions.length})` : 'প্রশ্নসমূহ'}
            </p>
            {mcqChapter && mcqChapter.mcq.questions.length > 0 ? (
              <div className="max-h-[480px] space-y-2 overflow-y-auto">
                {mcqChapter.mcq.questions.map((m, i) => (
                  <div key={m.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800">{i + 1}. {m.question}</p>
                      <p className="mt-1 text-xs text-emerald-700">সঠিক: {OPTIONS[m.correctIndex]}) {m.options[m.correctIndex]}</p>
                    </div>
                    <button
                      onClick={() => askDelete('MCQ মুছবেন?', `"${m.question.slice(0, 50)}${m.question.length > 50 ? '…' : ''}" প্রশ্নটি মুছে যাবে।`, () => mutate(`/mcq/${m.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                      className="shrink-0 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title={mcqChapter ? 'এই অধ্যায়ে এখনো কোনো MCQ নেই' : 'Chapter নির্বাচন করুন'} />
            )}
          </Card>
        </div>
      )}

      {tab === 'weekly' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 p-6">
            <p className="font-bold text-slate-800">নতুন Weekly Exam তৈরি করুন</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
              <input className={inputCls()} placeholder={`Exam Title (যেমন: Weekly Exam — Week ${String(db.weeklyExams.length + 1).padStart(2, '0')})`} value={wTitle} onChange={(e) => setWTitle(e.target.value)} />
              <input className={inputCls()} type="number" min={1} placeholder="Duration (min)" value={wDuration} onChange={(e) => setWDuration(Number(e.target.value) || 1)} />
            </div>
            <button
              type="button" {...btnPrimary()}
              disabled={!wTitle.trim()}
              onClick={async () => {
                try {
                  const data = await mutate('/weekly-exams', 'POST', { title: wTitle.trim(), durationMin: wDuration });
                  setWExamId(data.examId);
                  setWTitle('');
                  toast('success', 'Weekly Exam তৈরি হয়েছে ✓ এখন প্রশ্ন যোগ করুন।');
                } catch (e) {
                  toast('error', (e as Error).message);
                }
              }}
            >
              + Create Exam
            </button>

            <div className="border-t border-slate-100 pt-4">
              <p className="mb-2 text-sm font-bold text-slate-700">প্রশ্ন যোগ করুন (নিচে Exam নির্বাচন করুন):</p>
              <select className={inputCls()} value={wExamId} onChange={(e) => setWExamId(e.target.value)}>
                <option value="">Select Weekly Exam…</option>
                {db.weeklyExams.map((e) => <option key={e.id} value={e.id}>{e.title} ({e.questions.length} Q)</option>)}
              </select>
            </div>
            {selectedExam ? (
              <McqForm
                addQuestion={async (m) => {
                  await mutate(`/weekly-exams/${selectedExam.id}/questions`, 'POST', m);
                }}
              />
            ) : (
              <p className="text-sm text-slate-500">প্রশ্ন যোগ করতে আগে Exam নির্বাচন করুন।</p>
            )}
          </Card>

          <Card className="p-6">
            <p className="mb-3 font-bold text-slate-800">সকল Weekly Exam</p>
            <div className="space-y-3">
              {db.weeklyExams.map((e) => (
                <div key={e.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{e.title}</p>
                      <p className="text-xs text-slate-500">{e.questions.length} Questions · {e.durationMin || e.questions.length} min</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/leaderboard/${e.id}`} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600">Leaderboard</Link>
                      <button
                        onClick={() => askDelete('Weekly Exam মুছবেন?', `"${e.title}" এবং এর সব প্রশ্ন ও ফলাফল মুছে যাবে।`, () => mutate(`/weekly-exams/${e.id}`, 'DELETE').catch((err) => toast('error', err.message)))}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <ChapterPicker value={wPick} onChange={setWPick} />
              <p className="mt-2 text-xs text-slate-400">Chapter থেকে দ্রুত প্রশ্ন কপি করতে চাইলে MCQ Builder ব্যবহার করুন।</p>
            </div>
          </Card>
        </div>
      )}

      {tab === 'results' && (
        <Card className="overflow-x-auto p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="font-bold text-slate-800">সকল Student-এর ফলাফল ({allResults.length})</p>
            <select className={`${inputCls()} w-44`} value={wFilter} onChange={(e) => setWFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="chapter">Chapter Tests</option>
              <option value="weekly">Weekly Exams</option>
            </select>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Exam</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Marks</th>
                <th className="px-5 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allResults.filter((r) => wFilter === 'all' || r.type === wFilter).map((r) => {
                const stu = db.users.find((u) => u.id === r.userId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{stu?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-slate-400">Roll {stu?.roll ?? '—'}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{r.title}</td>
                    <td className="px-5 py-3"><Badge tone="slate">{r.type === 'weekly' ? 'Weekly' : 'Chapter'}</Badge></td>
                    <td className="px-5 py-3 text-slate-500">{fmtDate(r.date)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">{r.obtained}/{r.total}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={r.percentage >= 80 ? 'green' : r.percentage >= 40 ? 'indigo' : 'red'}>{r.percentage}%</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {allResults.length === 0 && <p className="p-8 text-center text-sm text-slate-500">এখনো কোনো ফলাফল নেই।</p>}
        </Card>
      )}
    </div>
  );
}
