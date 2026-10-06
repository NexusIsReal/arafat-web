import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { DB, User } from '../types';
import { getSession, setSession } from '../lib/storage';

interface AppApi {
  db: DB;
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  mutate: (path: string, method?: string, body?: unknown) => Promise<any>;
}

const AppCtx = createContext<AppApi>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [userId, setUserId] = useState<string | null>(() => getSession());

  const refresh = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('state failed');
      setDb(await res.json());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  };

  useEffect(() => { refresh(); }, []);

  const mutate = async (path: string, method = 'POST', body?: unknown) => {
    const res = await fetch('/api' + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    if (data.state) setDb(data.state);
    return data;
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !db) return null;
    setUserId(data.id);
    setSession(data.id);
    return db.users.find((u) => u.id === data.id) ?? null;
  };

  const logout = () => {
    setUserId(null);
    setSession(null);
  };

  if (!db) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
        {!loadError ? (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="font-semibold text-slate-600">Database-এর সাথে সংযোগ হচ্ছে…</p>
          </>
        ) : (
          <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 shadow">
            <p className="text-lg font-bold text-rose-600">Server-এর সাথে সংযোগ করা যাচ্ছে না</p>
            <p className="mt-2 text-sm text-slate-600">
              SQLite Backend চালু নেই। প্রথমে এই Project ফোল্ডারে Terminal খুলে <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">npm run dev</code> (বা <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">npm start</code>) চালান, তারপর এই পেজ Reload করুন।
            </p>
            <button onClick={() => refresh()} className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              আবার চেষ্টা করুন
            </button>
          </div>
        )}
      </div>
    );
  }

  const user = db.users.find((u) => u.id === userId) ?? null;

  return <AppCtx.Provider value={{ db, user, login, logout, mutate }}>{children}</AppCtx.Provider>;
}

export function useApp() {
  return useContext(AppCtx);
}
