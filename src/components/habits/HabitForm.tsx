'use client';

import { useState } from 'react';
import { saveHabit, updateHabit } from '@/lib/habits';
import { validateHabitName } from '@/lib/validators';
import type { Habit } from '@/types/habit';

interface HabitFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
  habitToEdit?: Habit;
}

export default function HabitForm({ userId, onSuccess, onCancel, habitToEdit }: HabitFormProps) {
  const [name, setName] = useState(habitToEdit?.name || '');
  const [description, setDescription] = useState(habitToEdit?.description || '');
  const [frequency, setFrequency] = useState<'daily'>(habitToEdit?.frequency || 'daily');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (habitToEdit) {
      const updatedHabit: Habit = {
        ...habitToEdit,
        name: validation.value,
        description,
        frequency,
      };
      updateHabit(updatedHabit);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: validation.value,
        description,
        frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      saveHabit(newHabit);
    }
    
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        data-testid="habit-form"
        className="bg-surface rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="font-display text-xl font-bold text-foreground">{habitToEdit ? 'Edit Habit' : 'Create New Habit'}</h2>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="habit-name" className="text-sm font-medium text-foreground">Name</label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="habit-name-input"
            placeholder="E.g., Morning Run"
            className="border border-border-base p-2.5 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-background text-foreground"
          />
          {error && <p className="text-danger text-xs mt-1">{error}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="habit-description" className="text-sm font-medium text-foreground">Description (optional)</label>
          <textarea
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="habit-description-input"
            placeholder="Tell us more about it..."
            className="border border-border-base p-2.5 rounded-xl focus:ring-2 focus:ring-accent outline-none h-24 bg-background text-foreground"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="habit-frequency" className="text-sm font-medium text-foreground">Frequency</label>
          <select
            id="habit-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily')}
            data-testid="habit-frequency-select"
            className="border border-border-base p-2.5 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-background text-foreground"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-border-base rounded-xl hover:bg-background transition-colors text-secondary-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="habit-save-button"
            className="flex-1 px-4 py-2.5 bg-pink text-foreground rounded-xl hover:bg-pink-hover transition-colors font-medium shadow-pink"
          >
            Save Habit
          </button>
        </div>
      </form>
    </div>
  );
}
