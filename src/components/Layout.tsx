import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { db, user, logout } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const links: { to: string; label: string }[] = [
    { to: '/', label: 'Home' },
    { to: '/weekly', label: 'Weekly Exam' },
    { to: '/notices', label: 'Notices' },
  ];
  if (user?.role === 'student') {
    links.push({ to: '/dashboard', label: 'Dashboard' }, { to: '/progress', label: 'My Progress' }, { to: '/results', label: 'My Results' });
  }
  if (user?.role === 'teacher') links.push({ to: '/teacher', label: 'Teacher Panel' });
  if (user?.role === 'admin') {
    links.push({ to: '/dashboard', label: 'Dashboard' }, { to: '/admin', label: 'Admin Panel' }, { to: '/teacher', label: 'Teacher Panel' });
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-extrabold text-white shadow">
              eL
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900 sm:text-base">E-Learning Bangladesh</p>
              <p className="text-[11px] text-slate-500">{db.school.name} · {db.school.nameEn}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <div className="text-right leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-600">{user.role}</p>
                </div>
                <button
                  onClick={() => { logout(); nav('/'); }}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700">
                Login
              </Link>
            )}
          </div>

          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-100 bg-white px-4 pb-4 lg:hidden">
            <nav className="flex flex-col gap-1 pt-2">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === '/'} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              {user ? (
                <button
                  onClick={() => { logout(); setOpen(false); nav('/'); }}
                  className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-left text-sm font-semibold text-slate-700"
                >
                  Logout ({user.name})
                </button>
              ) : (
                <Link to="/login" className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-12 bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-white">{db.school.name}</p>
            <p className="text-sm">{db.school.nameEn}</p>
            <p className="mt-3 text-sm leading-relaxed">Learn → Practice → Test → Improve</p>
            <p className="mt-1 text-sm text-slate-400">শিখুন → অনুশীলন করুন → নিজেকে যাচাই করুন → উন্নতি করুন।</p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weekly" className="hover:text-white">Weekly Exam</Link></li>
              <li><Link to="/notices" className="hover:text-white">Notice Board</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>{db.school.address}</li>
              <li>Phone: {db.school.phone}</li>
              <li>Email: {db.school.email}</li>
              <li>EIIN: {db.school.eiin}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} E-Learning Bangladesh — Practice-Based School E-Learning Platform (Science Fair Demo)
        </div>
      </footer>
    </div>
  );
}
