import { render, screen, fireEvent } from '@testing-library/react';
import { vi, expect, beforeEach } from 'vitest';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(submitButton);

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || '{}');
    expect(session.email).toBe('test@example.com');
    
    const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('test@example.com');
  });

  it('shows an error for duplicate signup email', async () => {
    // Pre-populate user
    localStorage.setItem('habit-tracker-users', JSON.stringify([{
      id: '1',
      email: 'test@example.com',
      password: 'password123'
    }]));

    render(<SignupForm />);
    
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(submitButton);

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
  });

  it('submits the login form and stores the active session', async () => {
    // Pre-populate user
    localStorage.setItem('habit-tracker-users', JSON.stringify([{
      id: '1',
      email: 'test@example.com',
      password: 'password123'
    }]));

    render(<LoginForm />);
    
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(submitButton);

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || '{}');
    expect(session.email).toBe('test@example.com');
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.submit(submitButton);

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});

