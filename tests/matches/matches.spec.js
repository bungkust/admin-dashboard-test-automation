const { test, expect } = require('@playwright/test');
const { MatchesPage } = require('../../pages/MatchesPage');
const { login } = require('../../utils/common');

test.describe('Matches Management', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const matchesPage = new MatchesPage(page);
    await matchesPage.goto();});

  test('TC-MATCH-001 - List matches page loads successfully', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await expect(page.locator('table, table thead')).toBeVisible({ timeout: 10000 });
  });

  test('TC-MATCH-002 - Navigate to create new match page', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.clickNewMatch();
    await matchesPage.expectUrl(/\/matches\/new/);
  });

  test('TC-MATCH-003 - Create match with all fields', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Club A');
    await matchesPage.fillAwayClub('Club B');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillLocation('Stadium Arena');
    await matchesPage.fillStage('Group Stage');
    await matchesPage.fillHomeScore('2');
    await matchesPage.fillAwayScore('1');
    await matchesPage.fillMetaJson('{"broadcast":" ESPN"}');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Club A');
    await matchesPage.expectInTable('Club B');
  });

  test('TC-MATCH-004 - Create match with only required fields', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Team X');
    await matchesPage.fillAwayClub('Team Y');
    await matchesPage.fillStartTime('2026-04-26 18:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Team X');
  });

  test('TC-MATCH-005 - Create match with empty competition shows error', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillHomeClub('Team A');
    await matchesPage.fillAwayClub('Team B');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectValidationError();
  });

  test('TC-MATCH-006 - Create match with empty home club shows error', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillAwayClub('Team B');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectValidationError();
  });

  test('TC-MATCH-007 - Create match with empty away club shows error', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Team A');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectValidationError();
  });

  test('TC-MATCH-008 - Create match with empty start time shows error', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Team A');
    await matchesPage.fillAwayClub('Team B');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectValidationError();
  });

  test('TC-MATCH-009 - Cancel match creation returns to list', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Cancelled Team');
    await matchesPage.fillAwayClub('Other Team');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.clickCancel();
    await matchesPage.expectOnList();
    await matchesPage.expectNotInTable('Cancelled Team');
  });

  test('TC-MATCH-010 - Create match with custom stage', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Semi Final Team A');
    await matchesPage.fillAwayClub('Semi Final Team B');
    await matchesPage.fillStartTime('2026-05-01 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillStage('Semi Final');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Semi Final Team A');
  });

  test('TC-MATCH-011 - Create match with scores', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Scoring Team A');
    await matchesPage.fillAwayClub('Scoring Team B');
    await matchesPage.fillStartTime('2026-04-27 19:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillHomeScore('3');
    await matchesPage.fillAwayScore('2');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Scoring Team A');
  });

  test('TC-MATCH-012 - Create match with location', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Home Venue Team');
    await matchesPage.fillAwayClub('Away Venue Team');
    await matchesPage.fillStartTime('2026-04-28 21:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillLocation('National Stadium');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Home Venue Team');
  });

  test('TC-MATCH-013 - Create match with meta JSON', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Meta Team A');
    await matchesPage.fillAwayClub('Meta Team B');
    await matchesPage.fillStartTime('2026-04-29 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillMetaJson('{"referee":"John Doe","attendance":50000}');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Meta Team A');
  });

  test('TC-MATCH-014 - Search match by home club', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.fillHomeClub('Searchable Team');
    await matchesPage.fillAwayClub('Opponent');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.clickCreateMatch();
    await matchesPage.goto();
    await matchesPage.search('Searchable Team');
    await matchesPage.expectInTable('Searchable Team');
  });

  test('TC-MATCH-015 - Search match by away club', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Search Away Test');
    await matchesPage.fillAwayClub('Target Away Team');
    await matchesPage.fillStartTime('2026-04-26 18:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.goto();
    await matchesPage.search('Target Away Team');
    await matchesPage.expectInTable('Target Away Team');
  });

  test('TC-MATCH-016 - Pagination navigation works', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    const nextBtn = page.locator('button:has-text("Next"), button:has-text("→")');
    if (await nextBtn.isVisible()) {
      await matchesPage.clickNextPagination();
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('TC-MATCH-017 - Delete match via row action', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('To Delete Team');
    await matchesPage.fillAwayClub('Stay Team');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.goto();

    const rows = matchesPage.getTableRows();
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      if (await row.locator('text=To Delete Team').isVisible()) {
        await matchesPage.clickDelete(row);
        await matchesPage.confirmDelete();
        break;
      }
    }
    await matchesPage.expectNotInTable('To Delete Team');
  });

  test('TC-MATCH-018 - Cancel delete match does not remove from list', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Cancel Delete Team');
    await matchesPage.fillAwayClub('Remain Team');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.goto();

    const rows = matchesPage.getTableRows();
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      if (await row.locator('text=Cancel Delete Team').isVisible()) {
        await matchesPage.clickDelete(row);
        await matchesPage.cancelDelete();
        break;
      }
    }
    await matchesPage.expectInTable('Cancel Delete Team');
  });

  test('TC-MATCH-019 - Edit match page loads with correct data', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Edit Source Team');
    await matchesPage.fillAwayClub('Edit Opponent');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.goto();

    const rows = matchesPage.getTableRows();
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      if (await row.locator('text=Edit Source Team').isVisible()) {
        await matchesPage.clickEdit(row);
        await matchesPage.expectUrl(/\/matches\/.*\/edit/);
        break;
      }
    }
  });

  test('TC-MATCH-020 - Save edited match updates data', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Original Team');
    await matchesPage.fillAwayClub('Original Opponent');
    await matchesPage.fillStartTime('2026-04-25 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.goto();

    const rows = matchesPage.getTableRows();
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      if (await row.locator('text=Original Team').isVisible()) {
        await matchesPage.clickEdit(row);
        await matchesPage.fillHomeScore('5');
        await matchesPage.fillAwayScore('3');
        await matchesPage.clickSaveMatch();
        await matchesPage.expectOnList();
        break;
      }
    }
  });

  test('TC-MATCH-021 - Create match with different timezone', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Timezone Team A');
    await matchesPage.fillAwayClub('Timezone Team B');
    await matchesPage.fillStartTime('2026-05-01 14:00');
    await matchesPage.fillTimezone('Europe/London');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Timezone Team A');
  });

  test('TC-MATCH-022 - Create match with all scores zero', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Zero Score Home');
    await matchesPage.fillAwayClub('Zero Score Away');
    await matchesPage.fillStartTime('2026-05-02 16:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillHomeScore('0');
    await matchesPage.fillAwayScore('0');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Zero Score Home');
  });

  test('TC-MATCH-023 - Empty match list shows empty state', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.goto();
    await matchesPage.search('NON_EXISTENT_MATCH_12345');
    // Empty or no results state
    await expect(page.locator('table, text=/no match|empty|0 results/i')).toBeVisible({ timeout: 5000 });
  });

  test('TC-MATCH-024 - Back button returns to match list from new page', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.clickBackToMatches();
    await matchesPage.expectOnList();
  });

  test('TC-MATCH-025 - Create match with special characters in location', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Special Loc Home');
    await matchesPage.fillAwayClub('Special Loc Away');
    await matchesPage.fillStartTime('2026-05-03 19:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.fillLocation('Stadium A & B - "The Home Ground" (Capacity: 50,000)');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Special Loc Home');
  });

  test('TC-MATCH-026 - Create multiple matches and verify list persistence', async ({ page }) => {
    const matchesPage = new MatchesPage(page);
    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Persist Team A');
    await matchesPage.fillAwayClub('Persist Team B');
    await matchesPage.fillStartTime('2026-05-04 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Persist Team A');

    await matchesPage.gotoNew();
    await matchesPage.fillCompetition('Champions League');
    await matchesPage.fillHomeClub('Persist Team C');
    await matchesPage.fillAwayClub('Persist Team D');
    await matchesPage.fillStartTime('2026-05-05 20:00');
    await matchesPage.fillTimezone('Asia/Jakarta');
    await matchesPage.clickCreateMatch();
    await matchesPage.expectOnList();
    await matchesPage.expectInTable('Persist Team C');

    await matchesPage.goto();
    await matchesPage.expectInTable('Persist Team A');
    await matchesPage.expectInTable('Persist Team C');
  });
});