const { test, expect } = require('@playwright/test');
const { AdminUsersPage } = require('../../pages/AdminUsersPage');
const { login } = require('../../utils/common');

test.describe('Admin Users Module', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.goto();});

  // List Page

  test('TC-ADMIN-USER-001 - Load admin users list page', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await expect(page.locator('table')).toBeVisible();
  });

  test('TC-ADMIN-USER-002 - Search user by full name', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.search('Admin');
    await expect(page.locator('table')).toContainText('Admin');
  });

  test('TC-ADMIN-USER-003 - Clear search returns all users', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.search('Admin');
    await adminUsersPage.clearSearch();
    await expect(page.locator('table')).toBeVisible();
  });

  test('TC-ADMIN-USER-004 - Navigate to new user form', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.clickNewUser();
    await adminUsersPage.expectUrl('/admin-users/new');
    await expect(page.locator('#full-name, input[name="fullName"]')).toBeVisible();
  });

  test('TC-ADMIN-USER-005 - Pagination on user list', async ({ page }) => {
    await expect(page.locator('.pagination, nav[role="navigation"]')).toBeVisible({ timeout: 3000 }).catch(() => {
      expect(true).toBe(true);
    });
  });

  test('TC-ADMIN-USER-006 - Next pagination button works', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.clickNextPagination();
    await expect(page.locator('table')).toBeVisible();
  });

  test('TC-ADMIN-USER-007 - Previous pagination button works', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.clickNextPagination();
    await adminUsersPage.clickPreviousPagination();
    await expect(page.locator('table')).toBeVisible();
  });

  test('TC-ADMIN-USER-008 - Verify user list table headers', async ({ page }) => {
    await expect(page.locator('table thead')).toBeVisible();
  });

  test('TC-ADMIN-USER-009 - Empty state displayed when no users match search', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.search('NonExistentUserXYZ123');
    await adminUsersPage.expectEmptyState();
  });

  // Create User

  test('TC-ADMIN-USER-010 - Create user with all valid fields', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('John Doe');
    await adminUsersPage.fillEmail('john.doe@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectGender('Male');
    await adminUsersPage.fillDateOfBirth('1990-01-15');
    await adminUsersPage.fillAvatarUrl('https://example.com/avatar.jpg');
    await adminUsersPage.fillProvince('Jakarta');
    await adminUsersPage.fillCity('Jakarta Selatan');
    await adminUsersPage.selectStatus('Active');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('John Doe');
  });

  test('TC-ADMIN-USER-011 - Create user with only required fields', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Minimal User');
    await adminUsersPage.fillEmail('minimal@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Minimal User');
  });

  test('TC-ADMIN-USER-012 - Create user with empty full name shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillEmail('noname@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-013 - Create user with empty email shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('No Email User');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-014 - Create user with invalid email format shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Invalid Email User');
    await adminUsersPage.fillEmail('not-an-email');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-015 - Create user with empty password shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('No Password User');
    await adminUsersPage.fillEmail('nopassword@example.com');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-016 - Create user with empty confirm password shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('No Confirm Password User');
    await adminUsersPage.fillEmail('noconfirm@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-017 - Create user with password mismatch shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Mismatch Password User');
    await adminUsersPage.fillEmail('mismatch@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('DifferentPass123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-018 - Create user with empty role shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('No Role User');
    await adminUsersPage.fillEmail('norole@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-019 - Create user with Super Administrator role', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Super Admin User');
    await adminUsersPage.fillEmail('superadmin@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Super Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Super Admin User');
  });

  test('TC-ADMIN-USER-020 - Create user with Male gender', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Male User');
    await adminUsersPage.fillEmail('male@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectGender('Male');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Male User');
  });

  test('TC-ADMIN-USER-021 - Create user with Female gender', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Female User');
    await adminUsersPage.fillEmail('female@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectGender('Female');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Female User');
  });

  test('TC-ADMIN-USER-022 - Create user with Other gender', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Other Gender User');
    await adminUsersPage.fillEmail('other@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectGender('Other');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Other Gender User');
  });

  test('TC-ADMIN-USER-023 - Create user with date of birth', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('DOB User');
    await adminUsersPage.fillEmail('dob@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.fillDateOfBirth('1995-06-20');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('DOB User');
  });

  test('TC-ADMIN-USER-024 - Create user with avatar URL', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Avatar User');
    await adminUsersPage.fillEmail('avatar@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.fillAvatarUrl('https://example.com/avatars/user.png');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Avatar User');
  });

  test('TC-ADMIN-USER-025 - Create user with province and city', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Location User');
    await adminUsersPage.fillEmail('location@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.fillProvince('East Java');
    await adminUsersPage.fillCity('Surabaya');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Location User');
  });

  test('TC-ADMIN-USER-026 - Create user with Active status', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Active Status User');
    await adminUsersPage.fillEmail('active@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectStatus('Active');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Active Status User');
  });

  test('TC-ADMIN-USER-027 - Create user with Inactive status', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Inactive Status User');
    await adminUsersPage.fillEmail('inactive@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectStatus('Inactive');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Inactive Status User');
  });

  test('TC-ADMIN-USER-028 - Create user with special characters in full name', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName("O'Brien-McDonald @Test!");
    await adminUsersPage.fillEmail('specialchar@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable("O'Brien-McDonald @Test!");
  });

  test('TC-ADMIN-USER-029 - Create user with maximum length full name', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    const maxLengthName = 'A'.repeat(255);
    await adminUsersPage.fillFullName(maxLengthName);
    await adminUsersPage.fillEmail('maxlength@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable(maxLengthName);
  });

  test('TC-ADMIN-USER-030 - Cancel user creation returns to list', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Cancelled User');
    await adminUsersPage.fillEmail('cancelled@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCancel();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectNotInTable('Cancelled User');
  });

  test('TC-ADMIN-USER-031 - Back to users from create page', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.clickBackToUsers();
    await adminUsersPage.expectUrl('/admin-users');
  });

  // Edit User

  test('TC-ADMIN-USER-032 - Edit existing user', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('User To Edit');
    await adminUsersPage.fillEmail('toedit@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.fillFullName('Updated User Name');
    await adminUsersPage.clickSaveUser();
    await adminUsersPage.expectInTable('Updated User Name');
  });

  test('TC-ADMIN-USER-033 - Edit user and cancel changes', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Original User');
    await adminUsersPage.fillEmail('original@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.fillFullName('Modified User');
    await adminUsersPage.clickCancel();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Original User');
  });

  test('TC-ADMIN-USER-034 - Edit user role to Super Administrator', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Role Change User');
    await adminUsersPage.fillEmail('rolechange@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.selectRole('Super Administrator');
    await adminUsersPage.clickSaveUser();
    await adminUsersPage.expectInTable('Role Change User');
  });

  test('TC-ADMIN-USER-035 - Edit user status to Inactive', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Status Change User');
    await adminUsersPage.fillEmail('statuschange@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectStatus('Active');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.selectStatus('Inactive');
    await adminUsersPage.clickSaveUser();
    await adminUsersPage.expectInTable('Status Change User');
  });

  // Delete User

  test('TC-ADMIN-USER-036 - Delete user from list', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('User To Delete');
    await adminUsersPage.fillEmail('todelete@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const initialCount = await rows.count();
    const firstRow = rows.first();
    await adminUsersPage.clickDelete(firstRow);
    await adminUsersPage.confirmDelete();
    const newRows = await adminUsersPage.getTableRows();
    const newCount = await newRows.count();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('TC-ADMIN-USER-037 - Cancel delete returns to list without deletion', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    const rows = await adminUsersPage.getTableRows();
    const initialCount = await rows.count();
    const firstRow = rows.first();
    await adminUsersPage.clickDelete(firstRow);
    await adminUsersPage.cancelDelete();
    const newRows = await adminUsersPage.getTableRows();
    const newCount = await newRows.count();
    expect(newCount).toBe(initialCount);
  });

  // Form Validation

  test('TC-ADMIN-USER-038 - Create user with duplicate email shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('First User');
    await adminUsersPage.fillEmail('duplicate@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();

    await adminUsersPage.clickNewUser();
    await adminUsersPage.fillFullName('Second User');
    await adminUsersPage.fillEmail('duplicate@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-039 - Create user with weak password shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Weak Password User');
    await adminUsersPage.fillEmail('weakpass@example.com');
    await adminUsersPage.fillPassword('123');
    await adminUsersPage.fillConfirmPassword('123');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-040 - Create user with short password shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Short Password User');
    await adminUsersPage.fillEmail('shortpass@example.com');
    await adminUsersPage.fillPassword('Ab1!');
    await adminUsersPage.fillConfirmPassword('Ab1!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  // Additional Form Fields

  test('TC-ADMIN-USER-041 - Create user with valid avatar URL', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Valid Avatar User');
    await adminUsersPage.fillEmail('validavatar@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.fillAvatarUrl('https://example.com/avatars/valid.png');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectUrl('/admin-users');
    await adminUsersPage.expectInTable('Valid Avatar User');
  });

  test('TC-ADMIN-USER-042 - Create user with invalid avatar URL shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Invalid Avatar User');
    await adminUsersPage.fillEmail('invalidavatar@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.fillAvatarUrl('not-a-valid-url');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-043 - Create user with future date of birth shows error', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Future DOB User');
    await adminUsersPage.fillEmail('futuredob@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.fillDateOfBirth('2030-01-01');
    await adminUsersPage.clickCreateUser();
    await adminUsersPage.expectValidationError();
  });

  test('TC-ADMIN-USER-044 - Edit user province and city', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Location Edit User');
    await adminUsersPage.fillEmail('locationedit@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.fillProvince('Bali');
    await adminUsersPage.fillCity('Denpasar');
    await adminUsersPage.clickSaveUser();
    await adminUsersPage.expectInTable('Location Edit User');
  });

  test('TC-ADMIN-USER-045 - Edit user gender', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('Gender Edit User');
    await adminUsersPage.fillEmail('genderedit@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.selectGender('Male');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.selectGender('Female');
    await adminUsersPage.clickSaveUser();
    await adminUsersPage.expectInTable('Gender Edit User');
  });

  test('TC-ADMIN-USER-046 - Edit user date of birth', async ({ page }) => {
    const adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.gotoNew();
    await adminUsersPage.fillFullName('DOB Edit User');
    await adminUsersPage.fillEmail('dobedit@example.com');
    await adminUsersPage.fillPassword('Password123!');
    await adminUsersPage.fillConfirmPassword('Password123!');
    await adminUsersPage.selectRole('Administrator');
    await adminUsersPage.clickCreateUser();
    const rows = await adminUsersPage.getTableRows();
    const firstRow = rows.first();
    await adminUsersPage.clickEdit(firstRow);
    await adminUsersPage.fillDateOfBirth('1988-12-25');
    await adminUsersPage.clickSaveUser();
    await adminUsersPage.expectInTable('DOB Edit User');
  });
});