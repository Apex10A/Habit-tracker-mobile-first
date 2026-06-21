'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

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
    <Card padding="lg" className="w-full max-w-md space-y-8 shadow-xl">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">Welcome Back</h2>
        <p className="mt-2 text-sm text-secondary-text">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="auth-login-email"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" title="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="auth-login-password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-danger-muted border border-danger/20">
            <p className="text-danger text-xs font-medium text-center">{error}</p>
          </div>
        )}

        <Button type="submit" size="lg" fullWidth data-testid="auth-login-submit">
          Sign In
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary-text">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-accent hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}
