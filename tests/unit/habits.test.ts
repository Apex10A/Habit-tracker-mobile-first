import { toggleHabitCompletion, getHabits, saveHabit, updateHabit, deleteHabit } from '../../src/lib/habits';
import type { Habit } from '../../src/types/habit';

const mockHabit: Habit = {
  id: '1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Drink 8 glasses of water',
  frequency: 'daily',
  color: 'blue',
  emoji: '💧',
  createdAt: '2026-01-01',
  completions: ['2026-04-26'],
};

describe('habits utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getHabits', () => {
    it('returns an empty array when no habits are stored', () => {
      expect(getHabits()).toEqual([]);
    });

    it('returns stored habits', () => {
      localStorage.setItem('habit-tracker-habits', JSON.stringify([mockHabit]));
      expect(getHabits()).toEqual([mockHabit]);
    });

    it('normalizes legacy habits without color or emoji', () => {
      localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'legacy-1',
            userId: 'user-1',
            name: 'Legacy Habit',
            description: '',
            frequency: 'daily',
            createdAt: '2026-01-01',
            completions: [],
          },
        ])
      );

      expect(getHabits()[0]).toMatchObject({
        color: 'accent',
        emoji: '',
      });
    });
  });

  describe('saveHabit', () => {
    it('saves a habit to localStorage', () => {
      saveHabit(mockHabit);
      const stored = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
      expect(stored).toContainEqual(mockHabit);
    });
  });

  describe('updateHabit', () => {
    it('updates an existing habit', () => {
      localStorage.setItem('habit-tracker-habits', JSON.stringify([mockHabit]));
      const updatedHabit = { ...mockHabit, name: 'Updated Name' };
      updateHabit(updatedHabit);
      const stored = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
      expect(stored[0].name).toBe('Updated Name');
    });
  });

  describe('deleteHabit', () => {
    it('removes a habit by id', () => {
      localStorage.setItem('habit-tracker-habits', JSON.stringify([mockHabit]));
      deleteHabit(mockHabit.id);
      const stored = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
      expect(stored).toHaveLength(0);
    });
  });
});

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-27');
    expect(result.completions).toContain('2026-04-27');
    expect(result.completions).toHaveLength(2);
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-26');
    expect(result.completions).not.toContain('2026-04-26');
    expect(result.completions).toHaveLength(0);
  });

  it('does not mutate the original habit object', () => {
    const originalCompletionsCount = mockHabit.completions.length;
    toggleHabitCompletion(mockHabit, '2026-04-27');
    expect(mockHabit.completions).toHaveLength(originalCompletionsCount);
  });

  it('does not return duplicate completion dates', () => {
    // Current implementation doesn't check for existing date before adding, 
    // but the test description requires it. 
    // Let's see if the implementation handles it.
    // Actually, toggleHabitCompletion removes it if it exists.
    // So "does not return duplicate completion dates" might mean if it's already there, 
    // it shouldn't add it again if we were just adding (but we are toggling).
    // Wait, if it's there, it REMOVES it. So duplicates are impossible via toggle.
    // But what if the input habit already has duplicates?
    const habitWithDuplicates: Habit = {
      ...mockHabit,
      completions: ['2026-04-26', '2026-04-26']
    };
    const result = toggleHabitCompletion(habitWithDuplicates, '2026-04-27');
    const uniqueCompletions = new Set(result.completions);
    expect(result.completions.length).toBe(uniqueCompletions.size);
  });
});
