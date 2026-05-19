const { test, expect } = require('../../fixtures/page.fixture');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');

function generateUniqueCompetition() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    name: `Comp-DEL-${rand}`,
    season: `2025-2026`
  };
}

async function cleanupCompetition(competitionsPage, compName) {
  if (!compName || compName.includes('BRI Super League') || compName === 'BRI Super League') {
    return;
  }
  try {
    await competitionsPage.goto();
    await competitionsPage.search(compName);
    const rows = await competitionsPage.getTableRows();
    const deleteRow = rows.filter({ hasText: compName }).first();
    if (await deleteRow.isVisible().catch(() => false)) {
      await competitionsPage.clickDelete(deleteRow);
      await competitionsPage.confirmDelete();
      await competitionsPage.expectNotInTable(compName);
    }
  } catch (err) {
    console.warn(`Cleanup failed for competition ${compName}: ${err.message}`);
  }
}

test.describe('Delete Competition', () => {

  test('TC-DELETE-001 - Delete competition from list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    // Create the competition first
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    // Perform deletion
    await competitionsPage.search(uniqueComp.name);
    const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
    await expect(row).toBeVisible();

    await competitionsPage.clickDelete(row);
    await competitionsPage.confirmDelete();

    await competitionsPage.expectNotInTable(uniqueComp.name);
  });

  test('TC-DELETE-002 - Cancel delete does not remove competition', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await expect(row).toBeVisible();

      await competitionsPage.clickDelete(row);
      // Cancel deletion
      await page.locator('button:has-text("Cancel"), button:has-text("No")').first().click();

      await competitionsPage.expectNameInTable(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-DELETE-003 - Delete button is visible for each competition', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await expect(row).toBeVisible();

      const deleteButton = row.locator('button:has-text("Delete"), button:has-text("Remove")').first();
      await expect(deleteButton).toBeVisible();
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-DELETE-004 - Confirm dialog appears on delete', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await expect(row).toBeVisible();

      await competitionsPage.clickDelete(row);
      await expect(page.locator('dialog button:has-text("Delete"), [role="dialog"] button:has-text("Delete")').first()).toBeVisible({ timeout: 5000 });
      // Dismiss the confirm dialog so cleanup can run successfully
      await page.locator('dialog button:has-text("Cancel"), [role="dialog"] button:has-text("Cancel"), button:has-text("Cancel")').first().click();
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });
});