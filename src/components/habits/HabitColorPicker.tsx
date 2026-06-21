import type { HabitColor } from '@/types/habit';
import { HABIT_COLOR_OPTIONS } from '@/lib/habitAppearance';
import { cn } from '@/lib/cn';

type HabitColorPickerProps = {
  value: HabitColor;
  onChange: (color: HabitColor) => void;
};

export default function HabitColorPicker({ value, onChange }: HabitColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Habit color">
      {HABIT_COLOR_OPTIONS.map((option) => {
        const isSelected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
            data-testid={`habit-color-${option.id}`}
            onClick={() => onChange(option.id)}
            className={cn(
              'h-9 w-9 rounded-full border-2 transition-transform',
              option.swatchClass,
              isSelected
                ? 'border-foreground scale-110 shadow-md'
                : 'border-transparent hover:scale-105'
            )}
          />
        );
      })}
    </div>
  );
}
