'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion, updateHabit, deleteHabit } from '@/lib/habits';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  onEdit: () => void;
}

export default function HabitCard({ habit, onUpdate, onEdit }: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  const handleToggle = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);
    updateHabit(updatedHabit);
    onUpdate();
  };

  const handleConfirmDelete = () => {
    deleteHabit(habit.id);
    onUpdate();
    setIsDeleting(false);
  };

  if (isDeleting) {
    return (
      <div
        data-testid={`habit-card-${slug}`}
        className="p-4 border border-red-200 bg-red-50 rounded-lg shadow-sm flex flex-col gap-4"
      >
        <p className="text-red-800 font-medium text-center">Delete this habit?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDeleting(false)}
            className="flex-1 py-2 px-4 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            data-testid="confirm-delete-button"
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`p-4 border rounded-lg shadow-sm transition-all ${
        isCompletedToday ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`text-lg font-bold ${
              isCompletedToday ? 'text-green-800 line-through' : 'text-gray-900'
            }`}
          >
            {habit.name}
          </h3>
          <p className="text-sm text-gray-500">{habit.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            data-testid={`habit-streak-${slug}`}
            className="text-2xl font-bold text-orange-500"
          >
            {streak}🔥
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Streak</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          data-testid={`habit-complete-${slug}`}
          className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
            isCompletedToday
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompletedToday ? 'Completed' : 'Complete Today'}
        </button>
        <button
          onClick={onEdit}
          data-testid={`habit-edit-${slug}`}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Edit Habit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => setIsDeleting(true)}
          data-testid={`habit-delete-${slug}`}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete Habit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
