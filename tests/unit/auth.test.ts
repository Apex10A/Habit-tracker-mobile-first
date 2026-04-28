import { signup, login, logout, getSession } from '../../src/lib/auth';

describe('auth utility', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock crypto.randomUUID
    if (!global.crypto) {
      (global as any).crypto = { randomUUID: () => 'test-uuid' };
    } else if (!global.crypto.randomUUID) {
      (global.crypto as any).randomUUID = () => 'test-uuid';
    }
    
    // Mock window.location
    const oldLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  it('signs up a new user and creates a session', () => {
    signup('test@example.com', 'password123');
    const session = getSession();
    expect(session?.email).toBe('test@example.com');
    
    const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('test@example.com');
  });

  it('throws error when signing up with existing email', () => {
    signup('test@example.com', 'password123');
    expect(() => signup('test@example.com', 'other')).toThrow('User already exists');
  });

  it('logs in an existing user', () => {
    signup('test@example.com', 'password123');
    localStorage.removeItem('habit-tracker-session');
    
    login('test@example.com', 'password123');
    const session = getSession();
    expect(session?.email).toBe('test@example.com');
  });

  it('throws error for invalid login', () => {
    signup('test@example.com', 'password123');
    expect(() => login('test@example.com', 'wrong')).toThrow('Invalid email or password');
  });

  it('logs out and redirects', () => {
    signup('test@example.com', 'password123');
    logout();
    expect(getSession()).toBeNull();
    expect(window.location.href).toBe('/login');
  });
});
