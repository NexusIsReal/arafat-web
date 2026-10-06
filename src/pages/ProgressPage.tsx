import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, ProgressBar, Badge, EmptyState } from '../components/ui';
import { subjectProgress, chapterBest, overallAverage } from '../lib/progress';

export default function ProgressPage() {
  const { db, user } = useApp();
  if (!user) return null;

  const subjects = db.subjects.filter((s) => s.classId === user.classId);
  const avg = overallAverage(db, user, subjects);
  const weak = [...subjects].sort((a, b) => subjectProgress(db, user, a) - subjectProgress(db, user, b));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <SectionTitle
        title="Learning Progress"
        sub="কোন Subject-এ কতটুকু এগিয়েছো, কোথায় আরও Practice দরকার"
        action={<Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:underline">← Dashboard</Link>}
      />

      <Card className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">Overall Average</p>
          <p className="mt-1 text-4xl font-extrabold">{avg}%</p>
        </div>
        <p className="max-w-sm text-sm text-indigo-100">
          {avg >= 80 ? 'অসাধারণ! এভাবেই চালিয়ে যাও।' : avg >= 40 ? 'ভালো যাচ্ছে — দুর্বল Subject-গুলোতে বেশি ফোকাস করো।' : 'নিয়মিত Practice করলে খুব দ্রুত উন্নতি হবে।'}
        </p>
      </Card>

      <SectionTitle title="Subject-wise Progress" sub="Performance by subject" />
      <div className="space-y-4">
        {subjects.map((s) => {
          const p = subjectProgress(db, user, s);
          const chapters = db.chapters.filter((c) => c.subjectId === s.id).sort((a, b) => a.order - b.order);
          return (
            <Card key={s.id} className="p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-slate-800">{s.name}</p>
                <Badge tone={p >= 80 ? 'green' : p >= 40 ? 'indigo' : 'amber'}>{p}%</Badge>
              </div>
              <ProgressBar value={p} />
              <div className="mt-4 flex flex-wrap gap-2">
                {chapters.map((ch) => {
                  const best = chapterBest(db, user.id, ch.id);
                  const pct = best?.percentage ?? 0;
                  const hasQ = ch.mcq.questions.length > 0;
                  return (
                    <Link
                      key={ch.id}
                      to={`/chapter/${ch.id}`}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition hover:-translate-y-0.5 ${
                        !hasQ
                          ? 'bg-slate-50 text-slate-400 ring-slate-200'
                          : pct >= 80
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : pct > 0
                              ? 'bg-amber-50 text-amber-700 ring-amber-200'
                              : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                      }`}
                    >
                      {ch.name}{hasQ && best ? ` · ${pct}%` : hasQ ? ' · pending' : ' · soon'}
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-10">
        <SectionTitle title="কোথায় আরও Practice দরকার?" sub="সবচেয়ে দুর্বল Subject থেকে শুরু করো" />
        {weak.length === 0 ? (
          <EmptyState title="কোনো Subject নেই" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {weak.slice(0, 3).map((s, i) => (
              <Card key={s.id} className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority {i + 1}</p>
                <p className="mt-1 font-bold text-slate-800">{s.name}</p>
                <p className="mt-1 text-2xl font-extrabold text-rose-500">{subjectProgress(db, user, s)}%</p>
                <Link to={`/subject/${s.id}`} className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline">
                  Practice শুরু করো →
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
