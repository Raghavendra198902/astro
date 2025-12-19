/**
 * E2E Regression Tests - Authentication Flow
 * Tests complete user authentication journey
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/ASTOR AI|Astro/i);
    await expect(page.getByRole('heading', { name: /astro/i })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('should complete login flow with valid credentials', async ({ page }) => {
    // Navigate to login
    await page.goto('/auth/login');

    // Fill login form
    await page.fill('input[type="email"]', 'seeker@demo.com');
    await page.fill('input[type="password"]', 'demo1234');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Verify dashboard loaded
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('text=Register');

    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: /register|sign up/i })).toBeVisible();
  });

  test('should validate email format on registration', async ({ page }) => {
    await page.goto('/auth/register');

    await page.fill('input[type="email"]', 'invalidemail');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'seeker@demo.com');
    await page.fill('input[type="password"]', 'demo1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Logout
    await page.click('text=Logout');

    // Should redirect to home or login
    await expect(page).toHaveURL(/\/$|login/);
  });
});
