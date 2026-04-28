import type { User, Session } from '../types/auth';

const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';

function getUsers(): User[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function signup(email: string, password: string): void {
  const users = getUsers();
  
  if (users.find((u) => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2) + Date.now().toString(36),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  
  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function login(email: string, password: string): void {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = '/login';
}

export function getSession(): Session | null {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}
