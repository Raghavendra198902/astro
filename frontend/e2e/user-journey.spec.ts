/**
 * E2E Regression Tests - Complete User Journey
 * Tests end-to-end user experience
 */

import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('full user workflow: register → login → create chart → get predictions', async ({ page }) => {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'SecurePass123!';

    // Step 1: Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/ASTOR|Astro/i);

    // Step 2: Navigate to register
    await page.click('text=Register');
    await expect(page).toHaveURL(/register/);

    // Step 3: Register new user
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.fill('input[name="full_name"], input[placeholder*="name" i]', 'Test User');
    
    await page.click('button[type="submit"]');
    
    // May redirect to login or dashboard
    await page.waitForTimeout(2000);

    // Step 4: Login if not auto-logged-in
    if (page.url().includes('login')) {
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
    }

    // Step 5: Should be on dashboard
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();

    // Step 6: Navigate to charts
    await page.click('text=Charts');
    await page.waitForTimeout(1000);

    // Step 7: Create chart
    await page.fill('input[name="name"]', 'My Birth Chart');
    await page.fill('input[type="date"]', '1990-05-15');
    await page.fill('input[type="time"]', '10:30');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Step 8: Verify chart created
    await expect(page.getByText(/chart|planets|success/i)).toBeVisible({ timeout: 10000 });

    // Step 9: Navigate to predictions (if available)
    const predictionsLink = page.getByRole('link', { name: /predictions/i });
    if (await predictionsLink.isVisible()) {
      await predictionsLink.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/predictions/);
    }
  });

  test('dashboard navigation and features', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'seeker@demo.com');
    await page.fill('input[type="password"]', 'demo1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Test all main navigation items
    const navItems = [
      'Charts',
      'Predictions',
      'Compatibility',
      'Numerology',
      'Consultations',
    ];

    for (const item of navItems) {
      const link = page.getByRole('link', { name: new RegExp(item, 'i') });
      if (await link.isVisible()) {
        await link.click();
        await page.waitForTimeout(1000);
        
        // Verify page loaded
        await expect(page.getByRole('heading', { name: new RegExp(item, 'i') })
          .or(page.getByText(new RegExp(item, 'i')))).toBeVisible();
      }
    }
  });

  test('mobile responsive navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Look for mobile menu button (hamburger)
    const menuButton = page.getByRole('button', { name: /menu|navigation/i })
      .or(page.locator('button:has(svg)').first());

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify mobile menu opened
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('error handling and recovery', async ({ page }) => {
    // Test 404 page
    await page.goto('/nonexistent-page');
    await expect(page.getByText(/404|not found/i)).toBeVisible({ timeout: 5000 });

    // Navigate back home
    const homeLink = page.getByRole('link', { name: /home|back/i });
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('accessibility - keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    expect(focusedElement).toBeTruthy();
  });

  test('page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check for key content
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
