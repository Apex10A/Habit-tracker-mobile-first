import LoginForm from '@/components/auth/LoginForm';
import AppHeader from '@/components/shared/AppHeader';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-purple),transparent_40%)] opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-pink),transparent_40%)] opacity-50 pointer-events-none" />
        <LoginForm />
      </div>
    </div>
  );
}
