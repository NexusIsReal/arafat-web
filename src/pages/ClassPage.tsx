import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, EmptyState } from '../components/ui';

export default function ClassPage() {
  const { classId } = useParams();
  const { db, user } = useApp();
  const cls = db.classes.find((c) => c.id === classId);

  if (!cls) return <div className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="Class not found" /></div>;

  const restricted = user?.role === 'student' && user.classId !== classId;
  const subjects = db.subjects.filter((s) => s.classId === classId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionTitle title={`${cls.name} — ${cls.nameBn}`} sub="এই শ্রেণির সকল Subject" action={<Link to={user ? '/dashboard' : '/'} className="text-sm font-semibold text-indigo-600 hover:underline">← Back</Link>} />

      {restricted ? (
        <EmptyState
          title="এটি তোমার শ্রেণি নয়"
          sub="প্ল্যাটফর্মের নিয়ম অনুযায়ী Student শুধু নিজের শ্রেণির কনটেন্ট দেখতে পারবে।"
        >
          <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">My Dashboard →</Link>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => {
            const chapters = db.chapters.filter((c) => c.subjectId === s.id);
            const tests = chapters.filter((c) => c.mcq.questions.length > 0).length;
            return (
              <Link key={s.id} to={`/subject/${s.id}`}>
                <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
                  <div className={`bg-gradient-to-r ${s.color} px-5 py-6 text-white`}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">{s.code}</p>
                    <p className="mt-1 text-lg font-extrabold">{s.name}</p>
                  </div>
                  <div className="p-5 text-sm text-slate-600">
                    <p>{chapters.length} Chapters</p>
                    <p className="mt-1">{tests} MCQ Tests available</p>
                    <p className="mt-3 text-xs font-semibold text-indigo-600">Open →</p>
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
