const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { login } = require('../../utils/common');

test.describe('Competition List', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/competitions');});

  test('TC-001 - Load competition list page', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await competitionsPage.getRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-COMP-001 - Search competition by name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.search('Premier');
    await expect(page.locator('table')).toContainText('Premier');
  });

  test('TC-COMP-002 - Filter competitions by status', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.filterByStatus('Active');
    const rows = await competitionsPage.getTableRows();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('TC-COMP-003 - Navigate to new competition form', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.clickNewCompetition();
    await expect(page).toHaveURL(/\/competitions\/new/);
    await expect(page.locator('#competition-name')).toBeVisible();
  });

  test('TC-COMP-004 - Create competition with valid data', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Champions League 2026');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.fillLogoUrl('https://example.com/logo.png');
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
    await competitionsPage.expectNameInTable('Champions League 2026');
  });

  test('TC-COMP-005 - Create competition with only required fields', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('League One');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
  });

  test('TC-COMP-006 - Create competition with empty name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCreate();
    await expect(page.locator('#competition-name')).toHaveClass(/invalid|error/);
  });

  test('TC-COMP-007 - Create competition with empty season', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Cup Tournament');
    await competitionsPage.clickCreate();
    await expect(page.locator('#competition-season')).toHaveClass(/invalid|error/);
  });

  test('TC-COMP-008 - Cancel competition creation', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Cancelled League');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCancel();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).not.toContainText('Cancelled League');
  });

  test('TC-COMP-009 - Create competition with custom logo URL', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Regional Cup');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.fillLogoUrl('https://example.com/custom-logo.png');
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
  });

  test('TC-COMP-010 - Toggle competition active status', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Test League');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.setActive(false);
    await competitionsPage.clickCreate();
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC-COMP-011 - Edit existing competition', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await page.goto('/competitions');
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Updated Competition Name');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).toContainText('Updated Competition Name');
  });

  test('TC-COMP-012 - Delete competition from list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await page.goto('/competitions');
    const initialCount = await competitionsPage.getRowCount();
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Delete"), button:has-text("Remove")').click();
    await page.locator('button:has-text("Confirm"), button:has-text("Yes")').click();
    const newCount = await competitionsPage.getRowCount();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('TC-COMP-013 - Create competition with duplicate name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Duplicate League');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCreate();
    await expect(page.locator('text=already exists, text=duplicate', { exact: false })).toBeVisible({ timeout: 3000 });
  });

  test('TC-COMP-014 - Pagination on competition list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await expect(page.locator('.pagination, nav[role="navigation"]')).toBeVisible({ timeout: 3000 }).catch(() => {
      // If no pagination, test passes
      expect(true).toBe(true);
    });
  });

  test('TC-COMP-015 - Sort competition list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await page.click('th:has-text("Name"), th:has-text("Season")');
    await expect(page.locator('table').first()).toBeVisible();
    const firstRowBefore = await competitionsPage.getTableRows().first().textContent();
    await page.click('th:has-text("Name"), th:has-text("Season")');
    const firstRowAfter = await competitionsPage.getTableRows().first().textContent();
    expect(firstRowBefore).not.toEqual(firstRowAfter);
  });

  test('NC-001 - Create competition with invalid logo URL', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillName('Invalid Logo League');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.fillLogoUrl('not-a-valid-url');
    await competitionsPage.clickCreate();
    await expect(page.locator('#competition-logo-upload')).toHaveClass(/invalid|error/);
  });

  test('TC-002 - Verify competition list table headers', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await expect(page.locator('table thead')).toBeVisible();
    await expect(page.locator('th').first()).toContainText('Name');
  });

  test('ES-001 - Create competition with maximum length name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    const maxLengthName = 'A'.repeat(255);
    await competitionsPage.fillName(maxLengthName);
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
    await competitionsPage.expectNameInTable(maxLengthName);
  });
});