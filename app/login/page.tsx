import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-accent),transparent_25%)] opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-accent),transparent_25%)] opacity-5 pointer-events-none" />
      <LoginForm />
    </div>
  );
}
