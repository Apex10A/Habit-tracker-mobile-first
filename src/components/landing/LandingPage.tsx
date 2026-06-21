'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import type { Session } from '@/types/auth';
import ThemeToggle from '@/components/shared/ThemeToggle';

const features = [
  {
    title: 'Streaks that motivate',
    description:
      'Complete habits daily and watch your streak grow. Consistency becomes visible—and harder to break.',
    tint: 'bg-pink/40',
  },
  {
    title: 'Always within reach',
    description:
      'Install as a PWA on your phone or desktop. Your habit list loads instantly, even without a connection.',
    tint: 'bg-blue/40',
  },
  {
    title: 'Your data stays yours',
    description:
      'Everything lives in your browser. Sign up when you are ready to save progress across sessions.',
    tint: 'bg-green/40',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create your habits',
    body: 'Add the routines that matter—exercise, reading, hydration, whatever you are building toward.',
  },
  {
    step: '02',
    title: 'Check in each day',
    body: 'One tap marks a habit complete. Your dashboard shows what is done and what is left today.',
  },
  {
    step: '03',
    title: 'Watch momentum build',
    body: 'Streaks reward showing up. Small wins compound into lasting change.',
  },
];

export default function LandingPage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return (
    <div data-testid="landing-page" className="min-h-screen flex flex-col">
      <header className="border-b border-border-base bg-background/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Habit Tracker
          </Link>
          <nav className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            {session ? (
              <Link
                href="/dashboard"
                data-testid="landing-dashboard-link"
                className="px-4 py-2 rounded-xl bg-pink text-foreground font-medium text-sm hover:bg-pink-hover transition-colors shadow-pink"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  data-testid="landing-login-link"
                  className="px-4 py-2 rounded-xl text-secondary-text font-medium text-sm hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  data-testid="landing-signup-link"
                  className="px-4 py-2 rounded-xl bg-pink text-foreground font-medium text-sm hover:bg-pink-hover transition-colors shadow-pink"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-purple/30 via-background to-pink/20"
          />
          <div
            aria-hidden
            className="absolute top-10 right-0 w-72 h-72 bg-blue/30 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 w-64 h-64 bg-yellow/30 rounded-full blur-3xl"
          />

          <div className="relative max-w-5xl mx-auto px-4 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-4">
                  Offline-first habit tracking
                </p>
                <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-[1.1] tracking-tight">
                  Build habits that{' '}
                  <span className="text-accent">actually stick</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-secondary-text leading-relaxed max-w-xl">
                  A calm, focused app for daily routines. Track completions, grow streaks, and
                  keep momentum—without noise, clutter, or distractions.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={session ? '/dashboard' : '/signup'}
                    data-testid="landing-hero-cta"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-pink text-foreground font-semibold shadow-pink hover:bg-pink-hover transition-colors"
                  >
                    {session ? 'Open dashboard' : 'Start for free'}
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl border border-border-base bg-surface text-foreground font-semibold hover:border-border-strong transition-colors"
                  >
                    I already have an account
                  </Link>
                </div>
              </div>

              <div aria-hidden className="relative hidden lg:block">
                <div className="rounded-2xl border border-border-base bg-surface shadow-xl p-6 rotate-1">
                  <p className="text-xs font-semibold text-secondary-text uppercase tracking-wide mb-4">
                    Today
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-success/30 bg-success-muted/60 p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-success line-through">Morning run</p>
                          <p className="text-sm text-secondary-text mt-1">Before breakfast</p>
                        </div>
                        <p className="text-xl font-bold text-streak whitespace-nowrap">12 streak</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border-base bg-purple/30 p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-foreground">Read 20 pages</p>
                          <p className="text-sm text-secondary-text mt-1">Evening wind-down</p>
                        </div>
                        <p className="text-xl font-bold text-streak whitespace-nowrap">5 streak</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border-base bg-blue/30 p-4 opacity-80">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-foreground">Drink water</p>
                          <p className="text-sm text-secondary-text mt-1">8 glasses</p>
                        </div>
                        <p className="text-sm text-secondary-text">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border-base bg-surface/50">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-20">
            <div className="max-w-2xl mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Simple by design
              </h2>
              <p className="mt-3 text-secondary-text text-lg leading-relaxed">
                Habit Tracker does one thing well: help you show up every day. No social feeds,
                no gamification overload—just clarity and progress you can feel.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className={`rounded-2xl border border-border-base p-6 ${feature.tint}`}
                >
                  <h3 className="font-display text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-secondary-text leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border-base">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-12">
              How it works
            </h2>
            <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
              {steps.map((item) => (
                <li key={item.step}>
                  <p className="text-sm font-bold text-accent tabular-nums">{item.step}</p>
                  <h3 className="font-display mt-2 text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-secondary-text leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-border-base bg-purple/30">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Ready to build better days?
            </h2>
            <p className="mt-4 text-secondary-text text-lg max-w-xl mx-auto leading-relaxed">
              Create your first habit in under a minute. Free, private, and works offline from
              day one.
            </p>
            <Link
              href={session ? '/dashboard' : '/signup'}
              className="inline-flex items-center justify-center mt-8 px-8 py-3.5 rounded-2xl bg-pink text-foreground font-semibold shadow-pink hover:bg-pink-hover transition-colors"
            >
              {session ? 'Go to dashboard' : 'Create your account'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-base bg-surface">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-secondary-text">
          <p>Habit Tracker — a lightweight PWA for daily habits</p>
          <p>Built with Next.js. Data stored locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
}
