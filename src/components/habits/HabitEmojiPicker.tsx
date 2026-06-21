import { HABIT_EMOJI_SUGGESTIONS, sanitizeEmoji } from '@/lib/habitAppearance';
import Label from '@/components/ui/Label';
import { cn } from '@/lib/cn';

type HabitEmojiPickerProps = {
  value: string;
  onChange: (emoji: string) => void;
};

export default function HabitEmojiPicker({ value, onChange }: HabitEmojiPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="habit-emoji-input">Icon (optional)</Label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested habit icons">
        {HABIT_EMOJI_SUGGESTIONS.map((emoji) => {
          const isSelected = value === emoji;

          return (
            <button
              key={emoji}
              type="button"
              aria-pressed={isSelected}
              data-testid={`habit-emoji-${emoji}`}
              onClick={() => onChange(isSelected ? '' : emoji)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-colors',
                isSelected
                  ? 'border-accent bg-accent-muted/70'
                  : 'border-border-base bg-background hover:border-accent/40'
              )}
            >
              {emoji}
            </button>
          );
        })}
      </div>
      <input
        id="habit-emoji-input"
        type="text"
        inputMode="text"
        maxLength={4}
        value={value}
        placeholder="Or type an emoji"
        data-testid="habit-emoji-input"
        onChange={(event) => onChange(sanitizeEmoji(event.target.value))}
        className="w-full rounded-xl border border-border-base bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}
