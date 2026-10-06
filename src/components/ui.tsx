import type { ReactNode } from 'react';

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

const barColor = (v: number) =>
  v >= 80 ? 'from-emerald-500 to-green-400' : v >= 40 ? 'from-indigo-500 to-blue-400' : 'from-amber-500 to-orange-400';

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${barColor(value)} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
        <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <p className="font-semibold text-slate-700">{title}</p>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Stat({ label, value, color = 'text-indigo-600' }: { label: string; value: ReactNode; color?: string }) {
  return (
    <Card className="p-4 text-center sm:p-5">
      <p className={`text-2xl font-extrabold sm:text-3xl ${color}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
    </Card>
  );
}

export function Badge({ children, tone = 'indigo' }: { children: ReactNode; tone?: 'indigo' | 'green' | 'amber' | 'red' | 'slate' }) {
  const tones: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

export function inputCls() {
  return 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';
}

export function btnPrimary() {
  return { className: 'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50' };
}

export function ScoreRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const color = percentage >= 80 ? '#10b981' : percentage >= 40 ? '#6366f1' : '#f59e0b';
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${percentage * 3.6}deg, #e2e8f0 0deg)`,
      }}
    >
      <div className="flex flex-col items-center justify-center rounded-full bg-white" style={{ width: size - 22, height: size - 22 }}>
        <span className="text-2xl font-extrabold text-slate-900">{percentage}%</span>
        <span className="text-xs font-medium text-slate-500">Score</span>
      </div>
    </div>
  );
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function fmtTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
