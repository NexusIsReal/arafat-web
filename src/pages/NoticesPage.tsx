import { useApp } from '../context/AppContext';
import { Card, SectionTitle, fmtDate } from '../components/ui';

export default function NoticesPage() {
  const { db } = useApp();
  const notices = [...db.notices].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <SectionTitle title="Notice Board" sub={`${db.school.name} — সকল নোটিশ`} />
      <div className="space-y-4">
        {notices.map((n) => (
          <Card key={n.id} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg font-bold text-slate-900">{n.title}</p>
              <span className="text-xs font-semibold text-slate-400">{fmtDate(n.date)}</span>
            </div>
            <p className="mt-2 leading-relaxed text-slate-600">{n.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
