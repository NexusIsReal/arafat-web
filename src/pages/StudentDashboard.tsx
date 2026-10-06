import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, Stat, ProgressBar, Badge, fmtDate } from '../components/ui';
import { subjectProgress, overallAverage, completedChapters } from '../lib/progress';

export default function StudentDashboard() {
  const { db, user } = useApp();
  if (!user) return null;

  const cls = db.classes.find((c) => c.id === user.classId);
  const subjects = db.subjects.filter((s) => s.classId === user.classId);
  const subjectIds = subjects.map((s) => s.id);
  const myResults = db.results.filter((r) => r.userId === user.id).sort((a, b) => b.date.localeCompare(a.date));
  const completed = completedChapters(db, user, subjectIds);
  const avg = overallAverage(db, user, subjects);
  const nextExam = [...db.weeklyExams].sort((a, b) => a.weekNo - b.weekNo).find((e) => e.questions.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">স্বাগতম, {user.name}!</h1>
          <p className="mt-1 text-sm text-slate-500">
            {cls ? `${cls.name} · ${cls.nameBn}` : '—'} · Roll: {user.roll ?? '—'}
          </p>
        </div>
        {nextExam && (
          <Link to={`/quiz/weekly/${nextExam.id}`} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-3 text-sm font-bold text-white shadow transition hover:opacity-90">
            {nextExam.weekNo > 0 && `Weekly Exam — Week ${String(nextExam.weekNo).padStart(2, '0')} দিতে চাও? Start →`}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="My Subjects" value={subjects.length} />
        <Stat label="Chapters Completed" value={completed.length} color="text-emerald-600" />
        <Stat label="Tests Taken" value={myResults.length} color="text-amber-600" />
        <Stat label="Overall Average" value={`${avg}%`} color={avg >= 60 ? 'text-indigo-600' : 'text-rose-500'} />
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
