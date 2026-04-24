# Admin Dashboard Test Automation

Playwright-based automated testing for the Persib Admin Dashboard (https://dashboard-stg.psb.pixlebyte.com).

## Modules Covered

| Module | Test Cases |
|--------|-----------|
| Admin Users | 46 |
| Ads | 50 |
| Clubs | 29 |
| Competition | 50 |
| Contents | 26 |
| Matches | 26 |
| Merchant Voucher | 34 |
| **Total** | **261** |

## Setup

```bash
npm install
npx playwright install chromium
```

## Run Tests

```bash
npm test                    # headless
npm run test:headed         # visible browser
npm run test:ui             # Playwright UI mode
npm run report              # show HTML report
```

## Environment Variables

```bash
cp .env.example .env
# Edit .env with your credentials
```

| Variable | Default |
|----------|---------|
| `TEST_EMAIL` | `nureko@pixlebyte.com` |
| `TEST_PASSWORD` | `Abcd1234` |
| `BASE_URL` | `https://dashboard-stg.psb.pixlebyte.com` |

## Project Structure

```
├── config/
│   ├── credentials.js      # Login credentials (use env vars)
│   └── urls.js             # Base URLs
├── pages/                  # Page Object Models
│   ├── LoginPage.js
│   ├── CompetitionsPage.js
│   ├── ContentsPage.js
│   ├── AdsPage.js
│   ├── ClubsPage.js
│   ├── MatchesPage.js
│   └── MerchantVoucherPage.js
├── utils/
│   └── common.js           # Shared fixtures (login)
├── tests/
│   ├── auth/
│   └── competitions/       # 14 spec files
├── playwright.config.js
└── README.md
```

## Test Reports

HTML reports generated at `reports/html/` after each run.

## Notes

- Form field IDs are based on expected patterns. Verify actual IDs when staging is available.
- Tests use `common.loggedInPage` fixture for automatic login.
- Each module has its own Page Object class.
