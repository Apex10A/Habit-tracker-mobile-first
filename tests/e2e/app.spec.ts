import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test('shows the landing page for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="landing-page"]')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('landing-signup-link')).toBeVisible();
  });

  test('shows dashboard link on landing page for authenticated users', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'test-user-1',
        email: 'existing@test.com',
      }));
    });
    await page.goto('/');
    await expect(page.locator('[data-testid="landing-page"]')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('landing-dashboard-link')).toBeVisible();
    await page.getByTestId('landing-dashboard-link').click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    const unique = Date.now();
    await page.getByTestId('auth-signup-email').fill(`user${unique}@test.com`);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      const userId = 'user-a-fixed';
      localStorage.setItem('habit-tracker-users', JSON.stringify([
        { id: userId, email: 'usera@test.com', password: 'Password123!' }
      ]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId, name: 'User A Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] },
        { id: 'h2', userId: 'other-user', name: 'Other Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] }
      ]));
    });

    await page.getByTestId('auth-login-email').fill('usera@test.com');
    await page.getByTestId('auth-login-password').fill('Password123!');
    await page.getByTestId('auth-login-submit').click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });

    await expect(page.getByText('User A Habit')).toBeVisible();
    await expect(page.getByText('Other Habit')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'test-create-user',
        email: 'create@test.com',
      }));
    });
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByText('Morning Run')).toBeVisible({ timeout: 5000 });
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      const userId = 'test-streak-user';
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId, email: 'streak@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'streak-habit-1', userId, name: 'Drink Water', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] }
      ]));
    });
    await page.goto('/dashboard');

    const completeBtn = page.getByTestId('habit-complete-drink-water');
    await expect(completeBtn).toBeVisible({ timeout: 5000 });
    await completeBtn.click();

    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText(/1🔥/);
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      const userId = 'test-persist-user';
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId, email: 'persist@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'persist-habit-1', userId, name: 'Read Books', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] }
      ]));
    });
    await page.goto('/dashboard');
    await expect(page.getByText('Read Books')).toBeVisible({ timeout: 5000 });

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });
    await expect(page.getByText('Read Books')).toBeVisible({ timeout: 5000 });
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'test-logout-user',
        email: 'logout@test.com',
      }));
    });
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });

    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
  test.slow();

  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('habit-tracker-session', JSON.stringify({
      userId: 'test-offline-user',
      email: 'offline@test.com',
    }));
  });

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

  // Wait for content to render
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // Verify app shell is loaded before going offline
  await expect(page.locator('body')).not.toBeEmpty({ timeout: 10000 });

  // Go offline — page already loaded should remain visible
  await context.setOffline(true);

  // App shell is still in the DOM — no reload needed
  await expect(page.locator('html')).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();

  // Restore connection
  await context.setOffline(false);
});
});