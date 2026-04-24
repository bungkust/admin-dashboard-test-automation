const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { common } = require('../../utils/common');

test.describe('Edit Competition', () => {
  test.use({ loggedInPage: common.loggedInPage });

  test.beforeEach(async ({ loggedInPage }) => {
    await loggedInPage.goto('/competitions');
  });

  test('TC-EDIT-001 - Edit existing competition name', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Updated Competition Name');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(loggedInPage.locator('table')).toContainText('Updated Competition Name');
  });

  test('TC-EDIT-002 - Edit competition season', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillSeason('2026-2027');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(loggedInPage.locator('table')).toContainText('2026-2027');
  });

  test('TC-EDIT-003 - Edit competition logo URL', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillLogoUrl('https://example.com/new-logo.png');
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
  });

  test('TC-EDIT-004 - Toggle competition active status', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.setActive(false);
    await competitionsPage.clickSave();
    const checkbox = loggedInPage.locator('input[type="checkbox"]').first();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC-EDIT-005 - Edit competition with empty name shows error', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await loggedInPage.locator('#competition-name').clear();
    await competitionsPage.clickSave();
    await expect(loggedInPage.locator('#competition-name')).toHaveClass(/invalid|error/);
  });

  test('TC-EDIT-006 - Edit competition with empty season shows error', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await loggedInPage.locator('#competition-season').clear();
    await competitionsPage.clickSave();
    await expect(loggedInPage.locator('#competition-season')).toHaveClass(/invalid|error/);
  });

  test('TC-EDIT-007 - Cancel edit returns to list without changes', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Should Not Save');
    await competitionsPage.clickCancel();
    await competitionsPage.expectOnList();
    await expect(loggedInPage.locator('table')).not.toContainText('Should Not Save');
  });

  test('TC-EDIT-008 - Navigate to edit page from competition list', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.clickNewCompetition();
    await expect(loggedInPage).toHaveURL(/\/competitions\/new/);
  });

  test('TC-EDIT-009 - Edit multiple fields at once', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await competitionsPage.fillName('Multi Updated League');
    await competitionsPage.fillSeason('2026-2027');
    await competitionsPage.fillLogoUrl('https://example.com/multi-logo.png');
    await competitionsPage.setActive(false);
    await competitionsPage.clickSave();
    await competitionsPage.expectOnList();
    await expect(loggedInPage.locator('table')).toContainText('Multi Updated League');
  });

  test('TC-EDIT-010 - Save button is visible on edit form', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await expect(loggedInPage.locator('button:has-text("Save Competition")')).toBeVisible();
  });
});