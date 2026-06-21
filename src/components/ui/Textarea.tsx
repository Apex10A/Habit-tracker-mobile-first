import { cn } from '@/lib/cn';
import type { TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-border-base bg-background text-foreground',
        'placeholder:text-secondary-text/50 transition-all resize-none',
        'focus:ring-2 focus:ring-accent focus:border-transparent outline-none',
        className
      )}
      {...props}
    />
  );
}
