import { test, expect } from '../../src/fixtures';

test.describe('Form validation', () => {
  test('contact form asks for every required field when sent empty', async ({ page }) => {
    await page.goto('/contact');
    await page.getByTestId('contact-submit').click();

    for (const field of ['first-name', 'last-name', 'email', 'subject', 'message']) {
      await expect(page.getByTestId(`${field}-error`), `${field} error`).toBeVisible();
    }
  });

  test('login form asks for email and password when sent empty', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('email-error')).toHaveText('Email is required');
    await expect(page.getByTestId('password-error')).toHaveText('Password is required');
  });

  test('a customer can sign in and reach their account page', async ({ page }) => {
    const email = process.env.TOOLSHOP_USER_EMAIL;
    const password = process.env.TOOLSHOP_USER_PASSWORD;
    test.skip(!email || !password, 'Set TOOLSHOP_USER_EMAIL and TOOLSHOP_USER_PASSWORD to run this test');

    await page.goto('/auth/login');
    await page.getByTestId('email').fill(email!);
    await page.getByTestId('password').fill(password!);
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId('nav-menu')).toBeVisible();
  });
});
