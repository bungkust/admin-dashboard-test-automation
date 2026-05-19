const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ClubsPage } = require('../pages/ClubsPage');
const { AdminUsersPage } = require('../pages/AdminUsersPage');
const { AdsPage } = require('../pages/AdsPage');
const { CompetitionsPage } = require('../pages/CompetitionsPage');
const { ContentsPage } = require('../pages/ContentsPage');
const { MatchesPage } = require('../pages/MatchesPage');
const { MerchantVoucherPage } = require('../pages/MerchantVoucherPage');
const { SurveysPage } = require('../pages/SurveysPage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  clubsPage: async ({ page }, use) => {
    await use(new ClubsPage(page));
  },
  surveysPage: async ({ page }, use) => {
    await use(new SurveysPage(page));
  },
  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },
  adsPage: async ({ page }, use) => {
    await use(new AdsPage(page));
  },
  competitionsPage: async ({ page }, use) => {
    await use(new CompetitionsPage(page));
  },
  contentsPage: async ({ page }, use) => {
    await use(new ContentsPage(page));
  },
  matchesPage: async ({ page }, use) => {
    await use(new MatchesPage(page));
  },
  merchantVoucherPage: async ({ page }, use) => {
    await use(new MerchantVoucherPage(page));
  },
});

module.exports = { test, expect };
