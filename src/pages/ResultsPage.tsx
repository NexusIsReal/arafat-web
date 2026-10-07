import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, Badge, EmptyState, fmtDate } from '../components/ui';

type Filter = 'all' | 'weekly' | 'chapter';

export default function ResultsPage() {
  const { db, user } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  if (!user) return null;
  const results = db.results
    .filter((r) => r.userId === user.id)
    .filter((r) => filter === 'all' || r.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const all = db.results.filter((r) => r.userId === user.id);
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: all.length },
    { id: 'weekly', label: 'Weekly Exams', count: all.filter((r) => r.type === 'weekly').length },
    { id: 'chapter', label: 'Chapter Tests', count: all.filter((r) => r.type === 'chapter').length },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <SectionTitle title="My Results" sub="সকল পরীক্ষার ফলাফল" action={<Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:underline">← Dashboard</Link>} />
      {results.length === 0 ? (
        <EmptyState title="এখনো কোনো পরীক্ষা দাওনি" sub="Chapter MCQ Test বা Weekly Exam দিয়ে শুরু করো!">
          <Link to="/weekly" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">Weekly Exam →</Link>
        </EmptyState>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Exam</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Marks</th>
                <th className="px-5 py-3 text-right">Score</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-semibold text-slate-800">{r.title}</td>
                  <td className="px-5 py-3"><Badge tone="slate">{r.type === 'weekly' ? 'Weekly' : 'Chapter'}</Badge></td>
                  <td className="px-5 py-3 text-slate-500">{fmtDate(r.date)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-700">{r.obtained}/{r.total}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge tone={r.percentage >= 80 ? 'green' : r.percentage >= 40 ? 'indigo' : 'red'}>{r.percentage}%</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/result/${r.id}`} className="text-sm font-semibold text-indigo-600 hover:underline">Review →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
