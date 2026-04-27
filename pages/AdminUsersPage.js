const { expect } = require('@playwright/test');

class AdminUsersPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/admin-users');
  }

  async gotoNew() {
    await this.page.goto('/admin-users/new');
  }

  async gotoEdit(id) {
    await this.page.goto(`/admin-users/${id}/edit`);
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

  async clickFilter() {
    await this.page.click('button:has-text("Filter")');
  }

  async clickNewUser() {
    await this.page.click('a:has-text("New User"), button:has-text("New User"), [href*="/admin-users/new"]');
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

  // --- Form fields ---
  async fillFullName(value) {
    await this.page.fill('#fullName', value);
  }

  async fillEmail(value) {
    await this.page.fill('#email', value);
  }

  async fillPassword(value) {
    await this.page.fill('#password', value);
  }

  async fillConfirmPassword(value) {
    await this.page.fill('#confirmPassword', value);
  }

  async selectRole(role) {
    // role options: Administrator, Super Administrator
    await this.page.selectOption('#role', { label: role });
  }

  async selectGender(gender) {
    // gender options: Male, Female, Other
    await this.page.selectOption('#gender', { label: gender });
  }

  async fillDateOfBirth(value) {
    await this.page.fill('#dob', value);
  }

  async fillPhone(value) {
    await this.page.fill('#phone', value);
  }

  async selectProvince(value) {
    await this.page.selectOption('#province', { label: value });
  }

  async selectCity(value) {
    await this.page.selectOption('#city', { label: value });
  }

  async fillDeviceToken(value) {
    await this.page.fill('#deviceToken', value);
  }

  async fillAvatarUrl(value) {
    await this.page.fill('#avatar', value);
  }

  async fillParentId(value) {
    await this.page.fill('#parentId', value);
  }

  async clickCreateUser() {
    await this.page.click('button:has-text("Create User"), button:has-text("Create")');
  }

  async clickSaveUser() {
    await this.page.click('button:has-text("Save User"), button:has-text("Save")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToUsers() {
    await this.page.click('button:has-text("Back to Users")');
  }

  // --- Assertions ---
  async expectInTable(name) {
    await expect(this.page.locator('table')).toContainText(name);
  }

  async expectNotInTable(name) {
    await expect(this.page.locator('table')).not.toContainText(name);
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no user|belum ada|empty|0 results/i);
  }

  async expectValidationError() {
    await expect(this.page.locator('text=/error|validation|required|wajib|invalid|match/i')).toBeVisible({ timeout: 3000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { AdminUsersPage };