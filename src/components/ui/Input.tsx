import { cn } from '@/lib/cn';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-border-base bg-background text-foreground',
        'placeholder:text-secondary-text/50 transition-all',
        'focus:ring-2 focus:ring-accent focus:border-transparent outline-none',
        className
      )}
      {...props}
    />
  );
}
