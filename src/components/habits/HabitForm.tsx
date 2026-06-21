'use client';

import { useState } from 'react';
import { saveHabit, updateHabit } from '@/lib/habits';
import { validateHabitName } from '@/lib/validators';
import type { Habit } from '@/types/habit';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

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
    <Modal onClose={onCancel}>
      <Card padding="md" className="shadow-xl">
        <form onSubmit={handleSubmit} data-testid="habit-form" className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
          </h2>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="habit-name-input"
              placeholder="E.g., Morning Run"
            />
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-description">Description (optional)</Label>
            <Textarea
              id="habit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="habit-description-input"
              placeholder="Tell us more about it..."
              className="h-24"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-frequency">Frequency</Label>
            <Select
              id="habit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily')}
              data-testid="habit-frequency-select"
            >
              <option value="daily">Daily</option>
            </Select>
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" fullWidth data-testid="habit-save-button">
              Save Habit
            </Button>
          </div>
        </form>
      </Card>
    </Modal>
  );
}
