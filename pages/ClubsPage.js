const { expect } = require('@playwright/test');

class ClubsPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/clubs');
  }

  async gotoNew() {
    await this.page.goto('/clubs/new');
  }

  async gotoEdit(id) {
    await this.page.goto(`/clubs/${id}/edit`);
  }

  // --- List page ---
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const input = this.page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await input.clear();
    await input.fill(term);
    await input.press('Enter');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000); // Small buffer for DOM updates
  }

  async clickNewClub() {
    await this.page.click('a:has-text("New Club"), button:has-text("New Club"), [href*="/clubs/new"]');
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
  async fillName(value) {
    await this.page.fill('#club-name', value);
  }

  async fillShortName(value) {
    await this.page.fill('#club-short-name', value);
  }

  async fillClubCode(value) {
    await this.page.fill('#club-code', value);
  }

  async fillLogoUrl(value) {
    await this.page.locator('#club-logo, input[placeholder*="logo"]').fill(value);
  }

  async fillStadium(value) {
    await this.page.locator('#club-stadium, input[placeholder*="Stadium"]').first().fill(value);
  }

  async fillStadiumImageUrl(value) {
    await this.page.locator('#club-stadium-url, input[placeholder*="stadium"]').last().fill(value);
  }

  async fillDescription(value) {
    await this.page.fill('#club-description', value);
  }

  async fillWebsite(value) {
    await this.page.fill('#club-website', value);
  }

  async fillFoundedYear(value) {
    await this.page.fill('#club-founded-year', value);
  }

  async setActive(checked) {
    const cb = this.page.locator('input[type="checkbox"]').first();
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async clickCreateClub() {
    await this.page.click('button:has-text("Create Club")');
  }

  async clickSaveClub() {
    await this.page.click('button:has-text("Save Club"), button:has-text("Update Club")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToClubs() {
    await this.page.click('button:has-text("Back to Clubs")');
  }

  // --- Assertions ---
  async expectInTable(name) {
    await expect(this.page.locator('table')).toContainText(name);
  }

  async expectNotInTable(name) {
    await expect(this.page.locator('table')).not.toContainText(name);
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no club|belum ada|empty|0 results|tidak ditemukan/i);
  }

  async expectValidationError() {
    await expect(this.page.locator('.text-red-600, .bg-red-50, [role="alert"], .error-message').first()).toBeVisible({ timeout: 5000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { ClubsPage };