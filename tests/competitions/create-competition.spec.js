const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { login } = require('../../utils/common');

test.describe('Create Competition', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();});

  test('TC-CREATE-001 - Create competition with valid data', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.fillName('Champions League 2026');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.fillLogoUrl('https://example.com/logo.png');
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
    await competitionsPage.expectNameInTable('Champions League 2026');
  });

  test('TC-CREATE-002 - Create competition with only required fields', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.fillName('League One');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
  });

  test('TC-CREATE-003 - Create competition with empty name shows error', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCreate();
    await expect(page.locator('#competition-name')).toHaveClass(/invalid|error/);
  });

  test('TC-CREATE-004 - Create competition with empty season shows error', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.fillName('Cup Tournament');
    await competitionsPage.clickCreate();
    await expect(page.locator('#competition-season')).toHaveClass(/invalid|error/);
  });

  test('TC-CREATE-005 - Cancel competition creation returns to list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.fillName('Cancelled League');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCancel();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).not.toContainText('Cancelled League');
  });

  test('TC-CREATE-006 - Create competition with custom logo URL', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.fillName('Regional Cup');
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.fillLogoUrl('https://example.com/custom-logo.png');
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
  });
});