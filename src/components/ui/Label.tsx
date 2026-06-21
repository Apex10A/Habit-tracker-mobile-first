import { cn } from '@/lib/cn';
import type { LabelHTMLAttributes } from 'react';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export default function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn('text-sm font-semibold text-foreground ml-1', className)}
      {...props}
    >
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </label>
  );
}
