const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { common } = require('../../utils/common');

test.describe('Delete Competition', () => {
  test.use({ loggedInPage: common.loggedInPage });

  test.beforeEach(async ({ loggedInPage }) => {
    await loggedInPage.goto('/competitions');
  });

  test('TC-DELETE-001 - Delete competition from list', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const initialCount = await competitionsPage.getRowCount();
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Delete"), button:has-text("Remove")').click();
    await loggedInPage.locator('button:has-text("Confirm"), button:has-text("Yes")').click();
    const newCount = await competitionsPage.getRowCount();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('TC-DELETE-002 - Cancel delete does not remove competition', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const initialCount = await competitionsPage.getRowCount();
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Delete"), button:has-text("Remove")').click();
    await loggedInPage.locator('button:has-text("Cancel"), button:has-text("No")').click();
    const newCount = await competitionsPage.getRowCount();
    expect(newCount).toBe(initialCount);
  });

  test('TC-DELETE-003 - Delete button is visible for each competition', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const rows = await competitionsPage.getTableRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    const deleteButton = rows.first().locator('button:has-text("Delete"), button:has-text("Remove")');
    await expect(deleteButton).toBeVisible();
  });

  test('TC-DELETE-004 - Confirm dialog appears on delete', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    const firstRow = competitionsPage.getTableRows().first();
    await firstRow.locator('button:has-text("Delete"), button:has-text("Remove")').click();
    await expect(loggedInPage.locator('button:has-text("Confirm"), button:has-text("Yes")')).toBeVisible({ timeout: 3000 });
  });
});