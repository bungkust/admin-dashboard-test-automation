const { expect } = require('@playwright/test');

class CompetitionsPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/competitions');
  }

  async gotoNew() {
    await this.page.goto('/competitions/new');
  }

  // List page
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const searchInput = this.page.locator('input[type="search"], input[placeholder*="Search"], input[type="text"]').first();
    await searchInput.clear();
    await searchInput.fill(term);
  }

  async filterByStatus(status) {
    await this.page.click('button:has-text("Filter"), [placeholder*="Status"]');
    await this.page.click(`text=${status}`);
  }

  async clickNewCompetition() {
    await this.page.click('a:has-text("New Competition"), button:has-text("New Competition"), [href*="/competitions/new"]');
  }

  // Create form
  async fillName(value) {
    await this.page.fill('#competition-name', value);
  }

  async fillSeason(value) {
    await this.page.fill('#competition-season', value);
  }

  async fillLogoUrl(value) {
    await this.page.fill('#competition-logo-upload', value);
  }

  async setActive(checked) {
    const cb = this.page.locator('input[type="checkbox"]');
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async clickCreate() {
    await this.page.click('button:has-text("Create Competition")');
  }

  async clickSave() {
    await this.page.click('button:has-text("Save Competition")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async expectOnList() {
    await expect(this.page).toHaveURL(/\/competitions$/);
  }

  async expectNameInTable(name) {
    await expect(this.page.locator('table')).toContainText(name);
  }

  async getRowCount() {
    return this.getTableRows().count();
  }
}

module.exports = { CompetitionsPage };
