# Toolshop tests with Playwright

End-to-end and API tests for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com), a public demo shop built for test automation practice. Written in TypeScript with Playwright.

This is a personal project. It tests a public demo application and contains no code, data or test cases from any employer.

## What is covered

| Area | Tests | Type |
| --- | --- | --- |
| Guest checkout | Cart, guest details, address, payment, on desktop and on a phone-sized screen | UI |
| Product search | Results match the term, and match what the API returns | UI + API |
| Sorting and categories | Price order, category page | UI |
| Product page and cart | Name, price and line totals agree with the API | UI + API |
| Forms | Required-field validation on contact, login and checkout address | UI |
| API contracts | Product, product page and brand responses validated against schemas, across every page | API |
| API behavior | Paging, single product, 404, search, empty search, protected endpoint without a token | API |
| Accessibility | axe scan of key pages against WCAG 2 A and AA, with a baseline | UI |

27 tests in four projects: `api`, `ui`, `mobile` (the smoke path on a Pixel 7 viewport) and `a11y`.

The reasoning behind these choices, and what is deliberately left out, is in [docs/test-strategy.md](docs/test-strategy.md). What the suite has found so far is in [docs/findings.md](docs/findings.md).

## How the tests are written

- **Expected values come from the API, not from the test file.** The shop's catalog can change, so a UI test asks the API what the product is called and what it costs, then checks the page against that.
- **Page objects stay small.** They hold locators and the few actions that need a wait, such as search. Assertions live in the tests.
- **Selectors use `data-test` attributes**, which the application provides for this purpose.
- **No fixed waits.** Tests wait for the network response or the element they depend on.
- **Contracts are code.** API responses are parsed with zod schemas in `src/api/schemas.ts`, so a renamed or missing field fails with the exact path.
- **Steps read like the user journey.** Longer flows use `test.step`, so the report shows where a purchase broke, not just that it did.
- **Tags pick the run.** `@smoke` is the critical path, `@contract` the API contracts, `@a11y` the accessibility scan.

## Run it

```bash
npm ci
npx playwright install chromium
npx playwright test          # everything
npm run test:api             # API only
npm run test:ui              # UI only
npx playwright test --grep @smoke        # critical path only
npx playwright test --project=mobile     # smoke path on a phone-sized screen
npm run report               # open the HTML report
```

The sign-in test needs an account. Copy `.env.example` to `.env`, fill in one of the demo accounts the site documents, and export the variables before running. Without them the test is skipped.

## CI

GitHub Actions runs the type check and all tests on every push and pull request, and uploads the HTML report as an artifact. See [.github/workflows/tests.yml](.github/workflows/tests.yml).

## Next

- [ ] Find the cause of finding 1 (deep links in CI)
- [ ] Sign-in and account flows, using a saved session
- [ ] Firefox and WebKit projects
- [ ] Publish the HTML report with GitHub Pages
