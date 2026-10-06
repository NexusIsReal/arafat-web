const SESSION_KEY = 'elb_session_v1';

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSession(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}
