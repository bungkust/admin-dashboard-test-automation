const { test, expect } = require('../../fixtures/page.fixture');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');

function generateUniqueCompetition() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    name: `Comp-CRT-${rand}`,
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

test.describe('Create Competition', () => {

  test('TC-CREATE-001 - Create competition with valid data', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    try {
      await competitionsPage.gotoNew();
      await competitionsPage.fillName(uniqueComp.name);
      await competitionsPage.fillSeason(uniqueComp.season);
      await competitionsPage.fillLogoUrl('https://example.com/logo.png');
      await competitionsPage.setActive(true);
      await competitionsPage.clickCreate();
      await competitionsPage.expectOnList();
      await competitionsPage.expectNameInTable(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-CREATE-002 - Create competition with only required fields', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    try {
      await competitionsPage.gotoNew();
      await competitionsPage.fillName(uniqueComp.name);
      await competitionsPage.fillSeason(uniqueComp.season);
      await competitionsPage.clickCreate();
      await competitionsPage.expectOnList();
      await competitionsPage.expectNameInTable(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-CREATE-003 - Create competition with empty name shows error', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.gotoNew();
    await competitionsPage.fillSeason('2025-2026');
    await competitionsPage.clickCreate();
    await expect(page.locator('text=Competition name is required').first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-CREATE-004 - Create competition with empty season is allowed', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    try {
      await competitionsPage.gotoNew();
      await competitionsPage.fillName(uniqueComp.name);
      // Leave season empty
      await competitionsPage.clickCreate();
      await competitionsPage.expectOnList();
      await competitionsPage.expectNameInTable(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-CREATE-005 - Cancel competition creation returns to list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCancel();
    await competitionsPage.expectOnList();
    await expect(page.locator('table')).not.toContainText(uniqueComp.name);
  });

  test('TC-CREATE-006 - Create competition with custom logo URL', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    try {
      await competitionsPage.gotoNew();
      await competitionsPage.fillName(uniqueComp.name);
      await competitionsPage.fillSeason(uniqueComp.season);
      await competitionsPage.fillLogoUrl('https://example.com/custom-logo.png');
      await competitionsPage.setActive(true);
      await competitionsPage.clickCreate();
      await competitionsPage.expectOnList();
      await competitionsPage.expectNameInTable(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-CREATE-007 - Create competition with duplicate name shows error', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    // Create the first one
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      // Try creating another one with the same name and season
      await competitionsPage.gotoNew();
      await competitionsPage.fillName(uniqueComp.name);
      await competitionsPage.fillSeason(uniqueComp.season);
      await competitionsPage.clickCreate();

      // Check duplicate validation banner
      await expect(page.locator('text=failed to create competition').first()).toBeVisible({ timeout: 5000 });
      await competitionsPage.clickCancel();
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });
});