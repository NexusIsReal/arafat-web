import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, EmptyState, Badge } from '../components/ui';
import { chapterBest } from '../lib/progress';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const { db, user } = useApp();
  const subject = db.subjects.find((s) => s.id === subjectId);

  if (!subject) return <div className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="Subject not found" /></div>;

  const cls = db.classes.find((c) => c.id === subject.classId);
  const chapters = db.chapters.filter((c) => c.subjectId === subject.id).sort((a, b) => a.order - b.order);
  const restricted = user?.role === 'student' && user.classId !== subject.classId;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionTitle
        title={subject.name}
        sub={`${cls?.name ?? ''} · ${chapters.length} Chapters`}
        action={<Link to={user ? `/class/${subject.classId}` : '/'} className="text-sm font-semibold text-indigo-600 hover:underline">← Back to Class</Link>}
      />

      {restricted ? (
        <EmptyState title="এটি তোমার শ্রেণির Subject নয়" sub="শুধু নিজের শ্রেণির কনটেন্ট দেখা যাবে।">
          <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">My Dashboard →</Link>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {chapters.map((ch) => {
            const best = user ? chapterBest(db, user.id, ch.id) : null;
            const done = (best?.percentage ?? 0) >= 60;
            return (
              <Link key={ch.id} to={`/chapter/${ch.id}`} className="block">
                <Card className="flex items-center gap-4 p-4 transition hover:border-indigo-300 hover:shadow-md sm:p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-extrabold text-indigo-600">
                    {ch.order}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800">{ch.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {ch.lectures.length} Lecture · {ch.notes.length} Notes · {ch.practice.length} Practice ·{' '}
                      {ch.mcq.questions.length > 0 ? `${ch.mcq.questions.length} MCQ` : 'MCQ coming soon'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {best ? (
                      <Badge tone={done ? 'green' : best.percentage >= 40 ? 'amber' : 'red'}>
                        Best: {best.percentage}%
                      </Badge>
                    ) : ch.mcq.questions.length > 0 ? (
                      <Badge tone="slate">Not attempted</Badge>
                    ) : (
                      <Badge tone="slate">Coming soon</Badge>
                    )}
                    {done && <p className="mt-1 text-[11px] font-bold text-emerald-600">Completed ✓</p>}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
