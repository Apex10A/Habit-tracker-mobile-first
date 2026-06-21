import { cn } from '@/lib/cn';
import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-border-base bg-background text-foreground',
        'focus:ring-2 focus:ring-accent focus:border-transparent outline-none',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
