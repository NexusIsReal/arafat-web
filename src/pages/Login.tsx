import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, inputCls } from '../components/ui';

const DEMO_ACCOUNTS = [
  { role: 'Student', email: 'student@demo.com', password: 'demo123', name: 'Arafat Rahman — Class 9', color: 'from-blue-500 to-cyan-400' },
  { role: 'Teacher', email: 'teacher@demo.com', password: 'demo123', name: 'Kawsar Sarkar — ICT', color: 'from-emerald-500 to-teal-400' },
  { role: 'Admin', email: 'admin@demo.com', password: 'demo123', name: 'মোঃ আব্দুল করিম — প্রধান শিক্ষক', color: 'from-violet-500 to-purple-400' },
];

export default function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const doLogin = async (e?: React.FormEvent, cred?: { email: string; password: string }) => {
    e?.preventDefault();
    const em = cred?.email ?? email;
    const pw = cred?.password ?? password;
    try {
      const u = await login(em, pw);
      if (!u) {
        setError('ভুল Email বা Password। Demo accounts-এর যেকোনো একটি ব্যবহার করুন।');
        return;
      }
      nav(u.role === 'student' ? '/dashboard' : u.role === 'teacher' ? '/teacher' : '/admin');
    } catch {
      setError('Server-এর সাথে সংযোগ করা যাচ্ছে না — npm run dev চালু আছে কিনা দেখুন।');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Welcome Back!</h1>
          <p className="mt-2 text-slate-600">
            Josephite Learning-এ লগইন করে পড়াশোনা চালিয়ে যাও — Lecture দেখো, Practice করো এবং MCQ Test দাও।
          </p>

          <p className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Demo Accounts (Science Fair Demo)</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                onClick={() => doLogin(undefined, a)}
                className={`rounded-2xl bg-gradient-to-br ${a.color} p-4 text-left text-white shadow transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">{a.role} Login</p>
                <p className="mt-1 text-sm font-semibold">{a.name}</p>
                <p className="mt-2 font-mono text-[11px] opacity-90">{a.email}</p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">উপরের যেকোনো Card-এ Click করলেই সরাসরি Login হয়ে যাবে।</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={(e) => doLogin(e)} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Login</h2>
            {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">{error}</div>}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <input className={inputCls()} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@demo.com" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input className={inputCls()} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="demo123" required />
            </div>
            <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white shadow transition hover:bg-indigo-700">
              Login →
            </button>
            <p className="text-center text-xs text-slate-400">
              Demo Platform — Student Registration ভবিষ্যৎ সংস্করণে যোগ হবে।
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
