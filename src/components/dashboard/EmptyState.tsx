type EmptyStateProps = {
  onCreateHabit: () => void;
};

const suggestions = ['Drink water', 'Read 10 minutes', 'Take a morning walk'];

export default function EmptyState({ onCreateHabit }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center text-center py-10 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-purple/50 flex items-center justify-center mb-6">
        <span className="font-display text-2xl font-bold text-accent">+</span>
      </div>

      <h3 className="font-display text-xl font-bold text-foreground">
        Start with one habit
      </h3>
      <p className="mt-2 text-secondary-text max-w-sm leading-relaxed">
        Small daily actions build momentum. Create your first habit and check in each day
        to grow your streak.
      </p>

      <button
        type="button"
        onClick={onCreateHabit}
        className="mt-8 px-6 py-3 rounded-xl bg-pink text-foreground font-medium shadow-pink hover:bg-pink-hover transition-colors"
      >
        Create your first habit
      </button>

      <div className="mt-10 w-full max-w-md">
        <p className="text-xs font-medium text-secondary-text uppercase tracking-wide mb-3">
          Ideas to get started
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="px-3 py-1.5 rounded-full bg-surface border border-border-base text-sm text-secondary-text"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
