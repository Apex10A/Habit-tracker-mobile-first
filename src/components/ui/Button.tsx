import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-pink text-foreground hover:bg-pink-hover shadow-pink font-medium',
  secondary:
    'border border-border-base bg-surface text-secondary-text hover:bg-background',
  danger: 'bg-danger text-on-accent hover:opacity-90 font-medium',
  success: 'bg-success text-on-accent hover:opacity-90 font-medium',
  ghost: 'text-secondary-text hover:bg-background',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl font-bold active:scale-[0.98]',
  icon: 'p-2.5 rounded-xl',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-colors focus:ring-2 focus:ring-pink focus:ring-offset-2 outline-none disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
}
