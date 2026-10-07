import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, Stat, ProgressBar, Badge, fmtDate, btnPrimary } from '../components/ui';
import { subjectProgress, overallAverage, completedChapters, weakChapters } from '../lib/progress';
import { getLastLecture } from './ChapterPage';

export default function StudentDashboard() {
  const { db, user } = useApp();
  if (!user) return null;

  const cls = db.classes.find((c) => c.id === user.classId);
  const subjects = db.subjects.filter((s) => s.classId === user.classId);
  const subjectIds = subjects.map((s) => s.id);
  const myResults = db.results.filter((r) => r.userId === user.id).sort((a, b) => b.date.localeCompare(a.date));
  const completed = completedChapters(db, user, subjectIds);
  const avg = overallAverage(db, user, subjects);
  const weak = weakChapters(db, user, subjectIds);
  const upcomingExam = [...db.weeklyExams]
    .sort((a, b) => a.weekNo - b.weekNo)
    .find((e) => e.questions.length > 0 && !myResults.some((r) => r.type === 'weekly' && r.refId === e.id));
  const lastLec = getLastLecture();
  const lastChapter = lastLec ? db.chapters.find((c) => c.id === lastLec.chapterId) : null;
  const lastSubject = lastChapter ? db.subjects.find((s) => s.id === lastChapter.subjectId) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">স্বাগতম, {user.name}!</h1>
          <p className="mt-1 text-sm text-slate-500">
            {cls ? `${cls.name} · ${cls.nameBn}` : '—'} · Roll: {user.roll ?? '—'}
          </p>
        </div>
      </div>

      {/* Continue Learning + Upcoming Exam */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {lastChapter && lastSubject ? (
          <Link to={`/chapter/${lastChapter.id}`}>
            <Card className="flex items-center gap-4 border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-5 transition hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">▶</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">চলমান Lecture — Continue Learning</p>
                <p className="mt-0.5 truncate font-bold text-slate-900">{lastSubject.name} · Ch {lastChapter.order}: {lastChapter.name}</p>
                <p className="text-xs text-slate-500">শেষ দেখা লেকচার থেকে আবার শুরু করো</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-indigo-600">→</span>
            </Card>
          </Link>
        ) : (
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xl text-slate-500">▶</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">চলমান Lecture</p>
              <p className="mt-0.5 font-bold text-slate-700">কোনো লেকচার দেখা শুরু করোনি</p>
              <p className="text-xs text-slate-500">My Subjects থেকে একটি Chapter খুলো</p>
            </div>
          </Card>
        )}

        {upcomingExam ? (
          <Link to={`/quiz/weekly/${upcomingExam.id}`}>
            <Card className="flex items-center gap-4 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 transition hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-xl text-white">⏰</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Upcoming Exam</p>
                <p className="mt-0.5 truncate font-bold text-slate-900">Weekly Exam — Week {String(upcomingExam.weekNo).padStart(2, '0')}</p>
                <p className="text-xs text-slate-500">{upcomingExam.questions.length} প্রশ্ন · {upcomingExam.durationMin} মিনিট — তুমি এখনো অংশ নাও!</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-amber-600">Start →</span>
            </Card>
          </Link>
        ) : (
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">✓</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Upcoming Exam</p>
              <p className="mt-0.5 font-bold text-slate-700">এই সপ্তাহের সব পরীক্ষা শেষ</p>
              <p className="text-xs text-slate-500">নতুন Weekly Exam-এর জন্য অপেক্ষা করো</p>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="My Subjects" value={subjects.length} />
        <Stat label="Chapters Completed" value={completed.length} color="text-emerald-600" />
        <Stat label="Exams Taken" value={myResults.length} color="text-amber-600" />
        <Stat label="Overall Score" value={`${avg}%`} color={avg >= 60 ? 'text-indigo-600' : 'text-rose-500'} />
      </div>

      {/* Performance Analysis */}
      <div className="mt-10">
        <SectionTitle title="Performance Analysis" sub="তোমার পড়াশোনার অবস্থা একনজরে" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <p className="mb-4 font-bold text-slate-800">Subject-wise Score</p>
            <div className="space-y-3">
              {subjects.map((s) => {
                const p = subjectProgress(db, user, s);
                return (
                  <div key={s.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">{s.name}</span>
                      <span className={`font-bold ${p >= 80 ? 'text-emerald-600' : p >= 40 ? 'text-indigo-600' : 'text-rose-500'}`}>{p}%</span>
                    </div>
                    <ProgressBar value={p} />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <p className="mb-4 font-bold text-slate-800">
              Weak Chapters <span className="ml-2 text-xs font-medium text-rose-500">সেরা স্কোর ৬০%-এর নিচে</span>
            </p>
            {weak.length === 0 ? (
              <p className="text-sm text-slate-500">সব অধ্যায়ে ভালো করেছ! 🎉</p>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {weak.slice(0, 10).map((c) => {
                  const sub = db.subjects.find((s) => s.id === c.subjectId);
                  const best = myResults.find((r) => r.type === 'chapter' && r.refId === c.id);
                  return (
                    <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-100">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{sub?.name} · Ch {c.order}: {c.name}</p>
                        <p className="text-xs text-rose-500">সেরা স্কোর: {best ? `${best.percentage}%` : 'Test দাওনি'}</p>
                      </div>
                      <Link to={`/chapter/${c.id}`} className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700">
                        Practice করো →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <SectionTitle title="My Subjects" sub="Subject নির্বাচন করে Chapter-এ যাও" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => {
            const p = subjectProgress(db, user, s);
            const chapters = db.chapters.filter((c) => c.subjectId === s.id);
            return (
              <Link key={s.id} to={`/subject/${s.id}`}>
                <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
                  <div className={`bg-gradient-to-r ${s.color} px-5 py-4 text-white`}>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-xs opacity-90">{s.code} · {chapters.length} Chapters</p>
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">Learning Progress</span>
                      <span className="font-bold text-slate-800">{p}%</span>
                    </div>
                    <ProgressBar value={p} />
                    <p className="mt-3 text-xs text-slate-500">
                      {chapters.filter((c) => completed.some((cc) => cc.id === c.id)).length} / {chapters.filter((c) => c.mcq.questions.length > 0).length} tests completed
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle title="Recent Results" sub="সাম্প্রতিক পরীক্ষার ফলাফল" action={<Link to="/results" className="text-sm font-semibold text-indigo-600 hover:underline">View All →</Link>} />
          {myResults.length === 0 ? (
            <Card className="p-8 text-center text-sm text-slate-500">
              এখনো কোনো পরীক্ষা দাওনি। একটি Chapter বা Weekly Exam দিয়ে শুরু করো!
            </Card>
          ) : (
            <Card className="divide-y divide-slate-100">
              {myResults.slice(0, 5).map((r) => (
                <Link key={r.id} to={`/result/${r.id}`} className="flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-800">{r.title}</p>
                    <p className="text-xs text-slate-500">{fmtDate(r.date)}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone={r.percentage >= 80 ? 'green' : r.percentage >= 40 ? 'indigo' : 'red'}>{r.percentage}%</Badge>
                    <p className="mt-1 text-xs text-slate-500">{r.obtained}/{r.total}</p>
                  </div>
                </Link>
              ))}
            </Card>
          )}
        </div>

        <div>
          <SectionTitle title="Latest Notices" sub="নোটিশ" />
          <Card className="divide-y divide-slate-100">
            {db.notices.slice(0, 3).map((n) => (
              <div key={n.id} className="p-4">
                <p className="font-semibold text-slate-800">{n.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{n.body}</p>
                <p className="mt-1 text-[11px] text-slate-400">{fmtDate(n.date)}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
