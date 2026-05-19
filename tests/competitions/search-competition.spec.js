const { test, expect } = require('../../fixtures/page.fixture');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');

// Helper to generate a unique competition name to avoid collisions
function generateUniqueCompetition() {
  const uniqueId = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    name: `Comp-SRCH-${uniqueId}`,
    season: '2025-2026'
  };
}

async function cleanupCompetition(competitionsPage, name) {
  if (!name || name.includes('BRI Super League') || name === 'BRI Super League') {
    return;
  }
  try {
    await competitionsPage.goto();
    await competitionsPage.search(name);
    
    const rows = competitionsPage.getTableRows();
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.first();
      await competitionsPage.clickDelete(row);
      await competitionsPage.confirmDelete();
      await competitionsPage.page.waitForTimeout(1000);
    }
  } catch (e) {
    console.error(`Cleanup failed for competition ${name}:`, e);
  }
}

test.describe('Search Competition', () => {

  test('TC-SEARCH-001 - Search competition by name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    // Create the unique competition first
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      // Search for the newly created competition
      await competitionsPage.search(uniqueComp.name);
      await expect(page.locator('table').first()).toContainText(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-SEARCH-002 - Search returns no results for non-existent name', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.goto();
    await competitionsPage.search('NonExistentCompetitionXYZ123');
    const rows = competitionsPage.getTableRows();
    await expect(rows).toHaveCount(0);
  });

  test('TC-SEARCH-003 - Search by partial name matches results', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    // Create the unique competition first
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      // Search by partial name (e.g. the unique random suffix)
      const partialName = uniqueComp.name.substring(5);
      await competitionsPage.search(partialName);
      await expect(page.locator('table').first()).toContainText(uniqueComp.name);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-SEARCH-004 - Clear search shows all competitions', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition();

    // Create unique competition
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();

    try {
      const initialCount = await competitionsPage.getRowCount();

      // Search to narrow down list
      await competitionsPage.search(uniqueComp.name);
      const searchCount = await competitionsPage.getRowCount();
      expect(searchCount).toBe(1);

      // Clear search
      await competitionsPage.search('');
      const clearedCount = await competitionsPage.getRowCount();
      expect(clearedCount).toBeGreaterThanOrEqual(initialCount);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-SEARCH-005 - Search field is visible on competition list', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.goto();
    const searchInput = page.locator('input[placeholder*="Search competitions"], input[type="search"]').first();
    await expect(searchInput).toBeVisible();
  });
});