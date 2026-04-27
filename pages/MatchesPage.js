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
    await this.page.selectOption('#match-competition', { label: value });
  }

  async fillStatus(value) {
    await this.page.selectOption('#match-status', { label: value });
  }

  async fillHomeClub(value) {
    await this.page.selectOption('#match-home-club', { label: value });
  }

  async fillAwayClub(value) {
    await this.page.selectOption('#match-away-club', { label: value });
  }

  async fillStartTime(value) {
    // value format: 'YYYY-MM-DDTHH:mm' for datetime-local
    const normalized = value.replace(' ', 'T');
    await this.page.fill('#match-start-time', normalized);
  }

  async fillTimezone(value) {
    // Map common timezone names to dropdown labels
    const map = {
      'Asia/Jakarta': 'WIB (Jakarta, GMT+7)',
      'Asia/Makassar': 'WITA (Makassar, GMT+8)',
      'Asia/Jayapura': 'WIT (Jayapura, GMT+9)',
      'UTC': 'UTC (GMT+0)',
    };
    const label = map[value] || value;
    await this.page.selectOption('#match-timezone', { label });
  }

  async fillLocation(value) {
    await this.page.fill('#match-location', value);
  }

  async fillStage(value) {
    await this.page.fill('#match-stage', value);
  }

  async fillEvent(value) {
    await this.page.selectOption('#match-event', { label: value });
  }

  async fillHomeScore(value) {
    await this.page.fill('#match-home-score', value);
  }

  async fillAwayScore(value) {
    await this.page.fill('#match-away-score', value);
  }

  async fillMetaJson(value) {
    await this.page.fill('#match-meta', value);
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