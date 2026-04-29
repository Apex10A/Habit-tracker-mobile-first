import { render, screen, fireEvent, within } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';

describe('habit form', () => {
  const mockSession = {
    userId: 'user-1',
    email: 'test@example.com',
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('habit-tracker-session', JSON.stringify(mockSession));
    vi.clearAllMocks();
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<DashboardPage />);
    
    // Wait for dashboard to load
    const createButton = await screen.findByTestId('create-habit-button');
    fireEvent.click(createButton);
    
    const nameInput = screen.getByTestId('habit-name-input');
    
    // Clear name if any
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.submit(screen.getByTestId('habit-form'));

    // Since we're adding validation to make this test pass
    expect(await screen.findByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<DashboardPage />);
    
    const createButton = await screen.findByTestId('create-habit-button');
    fireEvent.click(createButton);
    
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Habit' } });
    fireEvent.change(screen.getByTestId('habit-description-input'), { target: { value: 'Description' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByText('New Habit')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const initialHabit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Old Name',
      description: 'Old Desc',
      frequency: 'daily',
      createdAt: '2023-01-01T00:00:00.000Z',
      completions: ['2023-01-01'],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([initialHabit]));

    render(<DashboardPage />);
    
    const editButton = await screen.findByTestId('habit-edit-old-name');
    fireEvent.click(editButton);
    
    const nameInput = screen.getByTestId('habit-name-input');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByText('Updated Name')).toBeInTheDocument();
    
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const updatedHabit = habits.find((h: any) => h.id === 'habit-1');
    expect(updatedHabit.name).toBe('Updated Name');
    expect(updatedHabit.userId).toBe('user-1');
    expect(updatedHabit.createdAt).toBe('2023-01-01T00:00:00.000Z');
    expect(updatedHabit.completions).toEqual(['2023-01-01']);
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Delete Me',
      description: 'Desc',
      frequency: 'daily',
      createdAt: '2023-01-01',
      completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    render(<DashboardPage />);
    
    const deleteButton = await screen.findByTestId('habit-delete-delete-me');
    fireEvent.click(deleteButton);
    
    // Check if confirmation is shown (HabitCard enters isDeleting state)
    expect(screen.getByText('Delete this habit?')).toBeInTheDocument();
    
    // Confirm delete
    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    expect(habits).toHaveLength(0);
  });

  it('toggles completion and updates the streak display', async () => {
    const today = new Date().toISOString().split('T')[0];
    const habit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Streak Habit',
      description: 'Desc',
      frequency: 'daily',
      createdAt: '2023-01-01',
      completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    render(<DashboardPage />);
    
    const streakElement = await screen.findByTestId('habit-streak-streak-habit');
    expect(streakElement).toHaveTextContent('0🔥');
    
    const completeButton = screen.getByTestId('habit-complete-streak-habit');
    fireEvent.click(completeButton);

    expect(streakElement).toHaveTextContent('1🔥');
    
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    expect(habits[0].completions).toContain(today);
  });
});

