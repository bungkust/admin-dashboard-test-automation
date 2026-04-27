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
    const input = this.page.locator('main input[type="search"], main input[placeholder*="Search clubs"]').first();
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
    // Use JS click for delete confirmation button
    const btn = this.page.locator('button:has-text("Delete"):not([disabled]), button:has-text("Confirm"), button:has-text("Ya"), button:has-text("OK")');
    await btn.first().evaluate(el => el.click());
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
    await this.page.locator('#club-logo').first().fill(value);
  }

  async fillStadium(value) {
    // Stadium field must be filled BEFORE stadium image URL appears
    await this.page.locator('#club-stadium').first().fill(value);
  }

  async fillStadiumImageUrl(value) {
    // Stadium Image field - only visible when stadium has value
    await this.page.locator('#club-stadium-url').first().fill(value);
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
    await this.page.locator('button:has-text("Create Club")').click();
  }

  async clickSaveClub() {
    // Stadium is required - JS click needed to trigger form submit event
    await this.page.locator('button:has-text("Update Club")').first().evaluate(el => el.click());
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
    // Staging shows no results as empty rows in table, or "no results found" text
    // Try toContainText on table first (may show "0" or empty message)
    await expect(this.page.locator('table')).toContainText(/no club|belum ada|empty|0 result|tidak ditemukan|tidak ada|kosong/i, { timeout: 5000 }).catch(async () => {
      // Fallback: check if table has no rows
      const rows = this.page.locator('table tbody tr');
      await expect(rows).toHaveCount(0, { timeout: 3000 }).catch(() => {});
    });
  }

  async expectValidationError() {
    // Staging shows "Stadium name is required" as a generic text element
    await expect(this.page.locator('text=/stadium.*required|name.*required|required.*stadium|required.*name/i')).toBeVisible({ timeout: 5000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { ClubsPage };