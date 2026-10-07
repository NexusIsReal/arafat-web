import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, EmptyState, Badge, btnPrimary, btnGhost, useToast } from '../components/ui';
import { chapterBest } from '../lib/progress';

const LAST_KEY = 'elb_last_lecture_v1';

export function markLastLecture(chapterId: string, chapterName: string, subjectId: string, subjectName: string) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ chapterId, chapterName, subjectId, subjectName, at: Date.now() }));
  } catch { /* ignore */ }
}

export function getLastLecture(): { chapterId: string; chapterName: string; subjectId: string; subjectName: string; at: number } | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ChapterPage() {
  const { chapterId } = useParams();
  const { db, user, mutate } = useApp();
  const toast = useToast();
  const [openPq, setOpenPq] = useState<string | null>(null);
  const [view, setView] = useState<'lecture' | 'notes' | 'practice'>('lecture');
  const [lecIdx, setLecIdx] = useState(0);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const chapter = db.chapters.find((c) => c.id === chapterId);
  if (!chapter) return <div className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="Chapter not found" /></div>;

  const subject = db.subjects.find((s) => s.id === chapter.subjectId)!;
  const cls = db.classes.find((c) => c.id === subject.classId)!;
  const best = user ? chapterBest(db, user.id, chapter.id) : null;
  const hasTest = chapter.mcq.questions.length > 0;

  const lec = chapter.lectures[Math.min(lecIdx, chapter.lectures.length - 1)];
  const lecComments = useMemo(
    () => (lec ? db.comments.filter((c) => c.lectureId === lec.id) : []),
    [lec?.id, db.comments]
  );

  useEffect(() => {
    if (lec) markLastLecture(chapter.id, chapter.name, subject.id, subject.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lec?.id]);

  const sendComment = async () => {
    if (!user || !lec || !comment.trim()) return;
    try {
      await mutate(`/lectures/${lec.id}/comments`, 'POST', { userId: user.id, body: comment.trim() });
      setComment('');
      toast('success', 'মন্তব্য যোগ হয়েছে ✓');
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  const canModerate = user && (user.role === 'teacher' || user.role === 'admin');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to={user ? '/dashboard' : '/'} className="hover:text-indigo-600">{cls.name}</Link>
        <span>/</span>
        <Link to={`/subject/${subject.id}`} className="hover:text-indigo-600">{subject.name}</Link>
        <span>/</span>
        <span className="font-semibold text-slate-700">{chapter.name}</span>
      </div>

      <SectionTitle
        title={`Chapter ${chapter.order}: ${chapter.name}`}
        sub={subject.name}
        action={
          hasTest ? (
            <Link to={`/quiz/chapter/${chapter.id}`} {...btnPrimary()}>
              Start MCQ Test ({chapter.mcq.questions.length} Q · {chapter.mcq.durationMin} min)
            </Link>
          ) : (
            <Badge tone="amber">MCQ Test coming soon</Badge>
          )
        }
      />

      {best && (
        <div className="mb-6 rounded-xl bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-800 ring-1 ring-indigo-100">
          তোমার সেরা স্কোর এই অধ্যায়ে: {best.percentage}% ({best.obtained}/{best.total}){' '}
          <Link to={`/result/${best.id}`} className="underline">ফলাফল দেখো →</Link>
        </div>
      )}

      {/* Section tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setView('lecture')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === 'lecture' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
          🎬 Lecture
        </button>
        <button onClick={() => setView('notes')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === 'notes' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
          📄 Notes ({chapter.notes.length})
        </button>
        <button onClick={() => setView('practice')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === 'practice' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
          ✍️ Practice ({chapter.practice.length})
        </button>
      </div>

      {/* Lecture player */}
      {view === 'lecture' && (
        lec ? (
          <>
            <Card className="overflow-hidden">
              <div className="aspect-video w-full bg-slate-900">
                <iframe
                  key={lec.id}
                  src={lec.videoUrl}
                  title={lec.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{lec.title}</p>
                    <p className="mt-1 text-sm font-semibold text-indigo-600">লেকচার {lecIdx + 1}/{chapter.lectures.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLecIdx((i) => Math.max(0, i - 1))}
                      disabled={lecIdx === 0}
                      {...btnGhost()}
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setLecIdx((i) => Math.min(chapter.lectures.length - 1, i + 1))}
                      disabled={lecIdx >= chapter.lectures.length - 1}
                      {...btnPrimary()}
                    >
                      Next →
                    </button>
                  </div>
                </div>
                {lec.description && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-100">
                    <p className="mb-1 font-bold text-slate-800">Lecture Description</p>
                    {lec.description}
                  </div>
                )}
              </div>
            </Card>

            {/* Comment box */}
            <Card className="mt-5 p-5">
              <p className="font-bold text-slate-800">Comments ({lecComments.length})</p>
              {user ? (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="তোমার প্রশ্ন বা মন্তব্য লেখো…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendComment(); }}
                  />
                  <button onClick={sendComment} disabled={!comment.trim()} {...btnPrimary()}>Post Comment</button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">মন্তব্য করতে <Link to="/login" className="font-semibold text-indigo-600 underline">Login</Link> করো।</p>
              )}
              <div className="mt-4 space-y-3">
                {lecComments.map((c) => {
                  const author = db.users.find((u) => u.id === c.userId);
                  return (
                    <div key={c.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {(author?.name ?? '?').charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                          {author?.name ?? 'Unknown'}
                          {author && <span className="ml-2 text-xs font-medium text-indigo-500">{author.role === 'teacher' ? 'শিক্ষক' : author.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}</span>}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">{c.body}</p>
                        <p className="mt-1 text-xs text-slate-400">{new Date(c.date).toLocaleString('bn-BD')}</p>
                      </div>
                      {canModerate && (
                        <button
                          title="Delete comment"
                          onClick={async () => {
                            try {
                              await mutate(`/comments/${c.id}`, 'DELETE', { userId: user!.id });
                              toast('success', 'মন্তব্য মুছে ফেলা হয়েছে');
                            } catch (e) {
                              toast('error', (e as Error).message);
                            }
                          }}
                          className="shrink-0 font-bold text-rose-500 hover:text-rose-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
                {lecComments.length === 0 && <p className="text-sm text-slate-400">এখনো কোনো মন্তব্য নেই — প্রথম মন্তব্যটি তুমিই করো!</p>}
              </div>
            </Card>
          </>
        ) : (
          <EmptyState title="এই অধ্যায়ে এখনো কোনো Lecture যোগ করা হয়নি" sub="শিক্ষক শীঘ্রই যোগ করবেন।" />
        )
      )}

      {/* Notes viewer */}
      {view === 'notes' && (
        <div className="space-y-3">
          {chapter.notes.length === 0 && <EmptyState title="এই অধ্যায়ে এখনো Notes যোগ করা হয়নি" />}
          {chapter.notes.map((n) => (
            <Card key={n.id} className="overflow-hidden" >
              <button
                onClick={() => setOpenNote(openNote === n.id ? null : n.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span className="font-semibold text-slate-800">{n.title}</span>
                <span className="text-sm font-bold text-indigo-600">{openNote === n.id ? 'Hide −' : 'Read +'}</span>
              </button>
              {openNote === n.id && (
                <div className="border-t border-slate-100">
                  <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap bg-slate-50 px-5 py-4 font-sans text-sm leading-relaxed text-slate-700">
                    {n.content}
                  </pre>
                  <div className="flex justify-end gap-2 border-t border-slate-100 p-3">
                    <button onClick={() => window.print()} {...btnGhost()}>🖨️ Print / Save as PDF</button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Practice */}
      {view === 'practice' && (
        chapter.practice.length === 0 ? (
          <EmptyState title="এই অধ্যায়ে এখনো Practice Question যোগ করা হয়নি" sub="শিক্ষক শীঘ্রই যোগ করবেন।" />
        ) : (
          <div className="space-y-3">
            {chapter.practice.map((p, i) => (
              <Card key={p.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenPq(openPq === p.id ? null : p.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <span className="font-medium text-slate-800"><strong className="text-indigo-600">Q{i + 1}.</strong> {p.question}</span>
                  <span className="shrink-0 text-sm font-bold text-indigo-600">{openPq === p.id ? 'Answer −' : 'Answer +'}</span>
                </button>
                {openPq === p.id && (
                  <div className="border-t border-slate-100 bg-emerald-50 px-5 py-4 text-sm leading-relaxed text-emerald-900">
                    <strong>উত্তর:</strong> {p.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      )}

      {/* MCQ CTA */}
      <div className="mt-10">
        {hasTest ? (
          <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
            <div>
              <p className="text-lg font-extrabold">{chapter.mcq.title}</p>
              <p className="mt-1 text-sm text-indigo-100">
                {chapter.mcq.questions.length} Questions · {chapter.mcq.durationMin} মিনিট · Submit করার পর Automatic Result
              </p>
            </div>
            <Link to={`/quiz/chapter/${chapter.id}`} className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow transition hover:bg-indigo-50">
              Start Test →
            </Link>
          </Card>
        ) : (
          <EmptyState title="এই অধ্যায়ের MCQ Test শিক্ষক শীঘ্রই যোগ করবেন" sub="Teacher Panel থেকে MCQ যোগ করা যায়।" />
        )}
      </div>
    </div>
  );
}
