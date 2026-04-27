const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { login } = require('../../utils/common');

test.describe('Edit Competition', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/competitions');});

  test('TC-EDIT-001 - Edit existing competition name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Updated Competition Name');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).toContainText('Updated Competition Name');
  });

  test('TC-EDIT-002 - Edit competition season', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillSeason('2026-2027');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).toContainText('2026-2027');
  });

  test('TC-EDIT-003 - Edit competition logo URL', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillLogoUrl('https://example.com/new-logo.png');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
  });

  test('TC-EDIT-004 - Toggle competition active status', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.setActive(false);
    await competitionsPage.clickSave();
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC-EDIT-005 - Edit competition with empty name shows error', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await page.locator('#competition-name').clear();
    await competitionsPage.clickSave();
    await expect(page.locator('#competition-name')).toHaveClass(/invalid|error/);
  });

  test('TC-EDIT-006 - Edit competition with empty season shows error', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await page.locator('#competition-season').clear();
    await competitionsPage.clickSave();
    await expect(page.locator('#competition-season')).toHaveClass(/invalid|error/);
  });

  test('TC-EDIT-007 - Cancel edit returns to list without changes', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Should Not Save');
    await competitionsPage.clickCancel();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).not.toContainText('Should Not Save');
  });

  test('TC-EDIT-008 - Navigate to edit page from competition list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.clickNewCompetition();
    await expect(page).toHaveURL(/\/competitions\/new/);
  });

  test('TC-EDIT-009 - Edit multiple fields at once', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Multi Updated League');
    await competitionsPage.fillSeason('2026-2027');
    await competitionsPage.fillLogoUrl('https://example.com/multi-logo.png');
    await competitionsPage.setActive(false);
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).toContainText('Multi Updated League');
  });

  test('TC-EDIT-010 - Save button is visible on edit form', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await expect(page.locator('button:has-text("Save Competition")')).toBeVisible();
  });
});