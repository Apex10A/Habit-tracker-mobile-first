'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      login(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-surface rounded-2xl shadow-xl border border-border-base">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-foreground">Welcome Back</h2>
        <p className="mt-2 text-sm text-secondary-text">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-foreground ml-1">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="auth-login-email"
              required
              className="w-full px-4 py-3 rounded-xl border border-border-base focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-background text-foreground transition-all placeholder:text-secondary-text/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="password" title="password" className="text-sm font-semibold text-foreground">Password</label>
              <a href="#" className="text-xs font-medium text-accent hover:underline">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="auth-login-password"
              required
              className="w-full px-4 py-3 rounded-xl border border-border-base focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-background text-foreground transition-all placeholder:text-secondary-text/50"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
            <p className="text-danger text-xs font-medium text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          data-testid="auth-login-submit"
          className="w-full bg-accent text-white py-3.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all font-bold shadow-lg shadow-accent/20"
        >
          Sign In
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary-text">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-accent hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
