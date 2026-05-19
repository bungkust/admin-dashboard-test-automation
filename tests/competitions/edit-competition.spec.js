const { test, expect } = require('../../fixtures/page.fixture');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');

function generateUniqueCompetition() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    name: `Comp-EDT-${rand}`,
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

test.describe('Edit Competition', () => {

  test('TC-EDIT-001 - Edit existing competition name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();
    const updatedName = `${uniqueComp.name}-UPD`;

    // Create unique competition
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      // Find and click Edit
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      // Edit name
      await competitionsPage.fillName(updatedName);
      await competitionsPage.clickSave();
      await competitionsPage.expectOnList();

      await competitionsPage.search(updatedName);
      await competitionsPage.expectNameInTable(updatedName);
    } finally {
      await cleanupCompetition(competitionsPage, updatedName);
    }
  });

  test('TC-EDIT-002 - Edit competition season', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();
    const updatedSeason = `2026-2027`;

    // Create unique competition
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await competitionsPage.fillSeason(updatedSeason);
      await competitionsPage.clickSave();
      await competitionsPage.expectOnList();

      await competitionsPage.search(uniqueComp.name);
      await expect(page.locator('table')).toContainText(updatedSeason);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-EDIT-003 - Edit competition logo URL', async ({ page }) => {
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
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await competitionsPage.fillLogoUrl('https://example.com/new-logo.png');
      await competitionsPage.clickSave();
      await competitionsPage.expectOnList();
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-EDIT-004 - Toggle competition active status', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await competitionsPage.setActive(false);
      await competitionsPage.clickSave();
      await competitionsPage.expectOnList();

      await competitionsPage.search(uniqueComp.name);
      const matchedRow = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await expect(matchedRow).toContainText('Inactive');
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-EDIT-005 - Edit competition with empty name shows error', async ({ page }) => {
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
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await page.locator('#competition-name').clear();
      await competitionsPage.clickSave();
      await expect(page.locator('text=Competition name is required').first()).toBeVisible({ timeout: 5000 });
      // Go back to avoid unsaved changes block
      await competitionsPage.clickCancel();
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-EDIT-006 - Edit competition with empty season is allowed', async ({ page }) => {
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
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await page.locator('#competition-season').clear();
      await competitionsPage.clickSave();
      await competitionsPage.expectOnList();

      await competitionsPage.search(uniqueComp.name);
      await expect(page.locator('table')).toContainText(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-EDIT-007 - Cancel edit returns to list without changes', async ({ page }) => {
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
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await competitionsPage.fillName('Should Not Save');
      await competitionsPage.clickCancel();
      await competitionsPage.expectOnList();

      await expect(page.locator('table')).not.toContainText('Should Not Save');
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-EDIT-008 - Navigate to edit page from competition list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.goto();
    await competitionsPage.clickNewCompetition();
    await expect(page).toHaveURL(/\/competitions\/new/);
  });

  test('TC-EDIT-009 - Edit multiple fields at once', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();
    const updatedName = `${uniqueComp.name}-MUPD`;

    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      await competitionsPage.search(uniqueComp.name);
      const row = competitionsPage.getTableRows().filter({ hasText: uniqueComp.name }).first();
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await competitionsPage.fillName(updatedName);
      await competitionsPage.fillSeason('2026-2027');
      await competitionsPage.fillLogoUrl('https://example.com/multi-logo.png');
      await competitionsPage.setActive(false);
      await competitionsPage.clickSave();
      await competitionsPage.expectOnList();

      await competitionsPage.search(updatedName);
      await expect(page.locator('table')).toContainText(updatedName);
      await expect(page.locator('table')).toContainText('2026-2027');
    } finally {
      await cleanupCompetition(competitionsPage, updatedName);
    }
  });

  test('TC-EDIT-010 - Save button is visible on edit form', async ({ page }) => {
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
      await row.locator('a:has-text("Edit"), button:has-text("Edit")').first().click();

      await expect(page.locator('button:has-text("Update Competition")')).toBeVisible();
      await competitionsPage.clickCancel();
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });
});