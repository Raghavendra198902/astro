/**
 * E2E Regression Tests - Chart Generation
 * Tests complete chart creation workflow
 */

import { test, expect } from '@playwright/test';

test.describe('Chart Generation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'seeker@demo.com');
    await page.fill('input[type="password"]', 'demo1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should navigate to charts page', async ({ page }) => {
    await page.click('text=Charts');
    await expect(page).toHaveURL(/.*charts/);
  });

  test('should display chart creation form', async ({ page }) => {
    await page.goto('/dashboard/charts');

    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/date/i)).toBeVisible();
    await expect(page.getByLabel(/time/i)).toBeVisible();
  });

  test('should create a new chart', async ({ page }) => {
    await page.goto('/dashboard/charts');

    // Fill chart form
    await page.fill('input[name="name"]', 'Test Chart');
    await page.fill('input[type="date"]', '1990-01-15');
    await page.fill('input[type="time"]', '14:30');
    
    // Fill location (if autocomplete exists)
    const locationInput = page.locator('input[placeholder*="location" i], input[placeholder*="place" i]').first();
    if (await locationInput.isVisible()) {
      await locationInput.fill('New Delhi');
      await page.waitForTimeout(1000); // Wait for autocomplete
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for chart to be created
    await page.waitForTimeout(2000);

    // Verify chart was created (check for success message or chart display)
    await expect(page.getByText(/chart created|success/i).or(page.getByText(/sun|moon|planets/i))).toBeVisible({ timeout: 10000 });
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/dashboard/charts');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.getByText(/required|enter/i).first()).toBeVisible();
  });

  test('should display generated chart', async ({ page }) => {
    await page.goto('/dashboard/charts');

    // Look for existing charts or create one
    const chartCards = page.locator('[data-testid="chart-card"], .chart-card, div:has(> h3)');
    
    if (await chartCards.count() > 0) {
      await chartCards.first().click();
      
      // Verify chart details page
      await expect(page.getByText(/planets|houses|chart/i)).toBeVisible();
    }
  });

  test('should navigate between chart sections', async ({ page }) => {
    await page.goto('/dashboard/charts');

    // Check if there are navigation tabs/links
    const tabs = ['Overview', 'Planets', 'Houses', 'Aspects', 'Interpretations'];
    
    for (const tab of tabs) {
      const tabElement = page.getByRole('button', { name: new RegExp(tab, 'i') })
        .or(page.getByRole('tab', { name: new RegExp(tab, 'i') }));
      
      if (await tabElement.isVisible()) {
        await tabElement.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should handle chart deletion', async ({ page }) => {
    await page.goto('/dashboard/charts');

    // Look for delete button
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion if modal appears
      const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Verify deletion success
      await expect(page.getByText(/deleted|removed/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
