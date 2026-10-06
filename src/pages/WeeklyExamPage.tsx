import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, EmptyState, Badge, fmtDate } from '../components/ui';
import { leaderboard } from '../lib/progress';

export function WeeklyExamList() {
  const { db, user } = useApp();
  const exams = [...db.weeklyExams].sort((a, b) => a.weekNo - b.weekNo);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <SectionTitle title="Weekly Exam" sub="প্রতি সপ্তাহে সাপ্তাহিক MCQ পরীক্ষা — নিয়মিত Practice করে নিজেকে যাচাই করো" />
      <div className="space-y-4">
        {exams.map((ex) => {
          const myBest = user
            ? db.results
                .filter((r) => r.userId === user.id && r.type === 'weekly' && r.refId === ex.id)
                .sort((a, b) => b.percentage - a.percentage)[0]
            : null;
          const board = leaderboard(db, ex.id);
          return (
            <Card key={ex.id} className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-sm font-extrabold text-white">
                      {String(ex.weekNo).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{ex.title}</p>
                      <p className="text-xs text-slate-500">{ex.questions.length} Questions · {ex.durationMin || ex.questions.length} min</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {myBest && <Badge tone={myBest.percentage >= 60 ? 'green' : 'amber'}>My Best: {myBest.percentage}%</Badge>}
                  {board.length > 0 && <Badge tone="indigo">{board.length} participants</Badge>}
                  {ex.questions.length > 0 ? (
                    user ? (
                      <Link to={`/quiz/weekly/${ex.id}`} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                        Start Exam →
                      </Link>
                    ) : (
                      <Link to="/login" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                        Login to Start →
                      </Link>
                    )
                  ) : (
                    <Badge tone="slate">Coming soon</Badge>
                  )}
                  <Link to={`/leaderboard/${ex.id}`} className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600">
                    Leaderboard
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function Leaderboard() {
  const { examId } = useParams();
  const { db, user } = useApp();
  const exam = db.weeklyExams.find((e) => e.id === examId);

  if (!exam) {
    return <div className="mx-auto max-w-4xl px-4 py-10"><EmptyState title="Exam not found" /></div>;
  }

  const rows = leaderboard(db, exam.id);
  const medal = ['bg-amber-400 text-amber-950', 'bg-slate-300 text-slate-700', 'bg-orange-300 text-orange-950'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <SectionTitle
        title="Leaderboard — Ranking"
        sub={exam.title}
        action={<Link to="/weekly" className="text-sm font-semibold text-indigo-600 hover:underline">← Weekly Exams</Link>}
      />

      {rows.length === 0 ? (
        <EmptyState title="এখনো কেউ পরীক্ষা দেয়নি" sub="প্রথম হয়ে Leaderboard-এর শীর্ষে থাকো!">
          {exam.questions.length > 0 && user && (
            <Link to={`/quiz/weekly/${exam.id}`} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">Start Exam →</Link>
          )}
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Class / Roll</th>
                <th className="px-5 py-3 text-right">Marks</th>
                <th className="px-5 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const isMe = user?.id === row.user.id;
                return (
                  <tr key={row.user.id} className={isMe ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}>
                    <td className="px-5 py-3">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${
                        medal[row.rank - 1] ?? 'bg-slate-100 text-slate-500'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-slate-800">{row.user.name}</span>
                      {isMe && <span className="ml-2 text-xs font-bold text-indigo-600">(You)</span>}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {db.classes.find((c) => c.id === row.user.classId)?.name ?? '—'} · Roll {row.user.roll ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">{row.result.obtained}/{row.result.total}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={row.result.percentage >= 80 ? 'green' : row.result.percentage >= 40 ? 'indigo' : 'red'}>
                        {row.result.percentage}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">Updated: {fmtDate(new Date().toISOString())} · প্রতিটি Student-এর সেরা স্কোর ধরা হয়েছে</p>
    </div>
  );
}
