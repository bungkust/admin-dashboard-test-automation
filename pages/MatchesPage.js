const { expect } = require('@playwright/test');

class MatchesPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/matches');
  }

  async gotoNew() {
    await this.page.goto('/matches/new');
  }

  async gotoEdit(id) {
    await this.page.goto(`/matches/${id}/edit`);
  }

  // --- List page ---
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const input = this.page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await input.clear();
    await input.fill(term);
  }

  async clickNewMatch() {
    await this.page.click('a:has-text("New Match"), button:has-text("New Match"), [href*="/matches/new"]');
  }

  async clickEdit(row) {
    await row.locator('button:has-text("Edit"), a:has-text("Edit")').click();
  }

  async clickDelete(row) {
    await row.locator('button:has-text("Delete"), a:has-text("Delete")').click();
  }

  async confirmDelete() {
    await this.page.click('button:has-text("Delete"):not([disabled]), button:has-text("Confirm"), button:has-text("Ya"), button:has-text("OK")');
  }

  async cancelDelete() {
    await this.page.click('button:has-text("Cancel"), button:has-text("Batal")');
  }

  async clickNextPagination() {
    await this.page.click('button:has-text("Next"), button:has-text("→")');
  }

  async clickPreviousPagination() {
    await this.page.click('button:has-text("Previous"), button:has-text("←")');
  }

  // --- Form ---
  async fillCompetition(value) {
    const select = this.page.locator('#competition, select[id="competition"]');
    await select.selectOption({ label: value });
  }

  async fillHomeClub(value) {
    await this.page.fill('#home-club, #homeClub, input[id="homeClub"]', value);
  }

  async fillAwayClub(value) {
    await this.page.fill('#away-club, #awayClub, input[id="awayClub"]', value);
  }

  async fillStartTime(value) {
    await this.page.fill('#start-time, #startTime, input[id="startTime"]', value);
  }

  async fillTimezone(value) {
    await this.page.fill('#timezone, select[id="timezone"], input[id="timezone"]', value);
  }

  async fillLocation(value) {
    await this.page.fill('#location, input[id="location"]', value);
  }

  async fillStage(value) {
    await this.page.fill('#stage, input[id="stage"]', value);
  }

  async fillHomeScore(value) {
    await this.page.fill('#home-score, #homeScore, input[id="homeScore"]', value);
  }

  async fillAwayScore(value) {
    await this.page.fill('#away-score, #awayScore, input[id="awayScore"]', value);
  }

  async fillMetaJson(value) {
    await this.page.fill('#meta-json, #metaJson, textarea[id="metaJson"]', value);
  }

  async clickCreateMatch() {
    await this.page.click('button:has-text("Create Match")');
  }

  async clickSaveMatch() {
    await this.page.click('button:has-text("Save Match")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToMatches() {
    await this.page.click('button:has-text("Back to Matches")');
  }

  // --- Assertions ---
  async expectInTable(text) {
    await expect(this.page.locator('table')).toContainText(text);
  }

  async expectNotInTable(text) {
    await expect(this.page.locator('table')).not.toContainText(text);
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no match|belum ada|empty|0 results/i);
  }

  async expectValidationError() {
    await expect(this.page.locator('text=/error|validation|required|wajib|invalid/i')).toBeVisible({ timeout: 3000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }

  async expectOnList() {
    await expect(this.page).toHaveURL(/\/matches$/);
  }
}

module.exports = { MatchesPage };