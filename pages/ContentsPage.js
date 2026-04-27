const { expect } = require('@playwright/test');

class ContentsPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/contents');
  }

  async gotoNew() {
    await this.page.goto('/contents/new');
  }

  async gotoEdit(id) {
    await this.page.goto(`/contents/${id}/edit`);
  }

  // --- List page ---
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const input = this.page.locator('input[type="search"], input[placeholder*="Search"], input[type="text"]').first();
    await input.clear();
    await input.fill(term);
  }

  async clearSearch() {
    const input = this.page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await input.clear();
  }

  async filterByType(type) {
    await this.page.click('button:has-text("Filter"), [placeholder*="Type"]');
    await this.page.click(`text=${type}`);
  }

  async clickNewContent() {
    await this.page.click('a:has-text("New Content"), button:has-text("New Content"), [href*="/contents/new"]');
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
  async fillTitle(value) {
    await this.page.fill('#title', value);
  }

  async selectType(type) {
    await this.page.selectOption('#type', type);
  }

  async fillBody(value) {
    const body = this.page.locator('[contenteditable]').first();
    await body.fill(value);
  }

  async fillMediaUrl(value) {
    await this.page.fill('#mediaUrl', value);
  }

  async fillAuthorName(value) {
    await this.page.fill('#authorName', value);
  }

  async fillPublishedAt(value) {
    await this.page.fill('#publishedAt', value);
  }

  async clickCreateContent() {
    await this.page.click('button:has-text("Create Content")');
  }

  async clickSaveContent() {
    await this.page.click('button:has-text("Save Content")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToContents() {
    await this.page.click('button:has-text("Back to Contents")');
  }

  // --- Assertions ---
  async expectInTable(title) {
    await expect(this.page.locator('table')).toContainText(title);
  }

  async expectNotInTable(title) {
    await expect(this.page.locator('table')).not.toContainText(title);
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no content|belum ada|empty|0 results/i);
  }

  async expectValidationError() {
    await expect(this.page.locator('text=/error|validation|required|wajib/i')).toBeVisible({ timeout: 3000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { ContentsPage };
