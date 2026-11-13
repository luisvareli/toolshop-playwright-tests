# Toolshop tests with Playwright

End-to-end and API tests for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com), a public demo shop built for test automation practice. Written in TypeScript with Playwright.

This is a personal project. It tests a public demo application and contains no code, data or test cases from any employer.

## What is covered

| Area | Tests | Type |
| --- | --- | --- |
| Product search | Results match the term, and match what the API returns | UI + API |
| Sorting and categories | Price order, category page | UI |
| Product page | Name and price agree with the API | UI + API |
| Cart | Quantity and line total at checkout | UI |
| Forms | Required-field validation on contact and login | UI |
| Products API | Paging, single product, 404, search, empty search | API |
| Catalog API | Brands, category tree, protected endpoint without a token | API |

The reasoning behind these choices, and what is deliberately left out, is in [docs/test-strategy.md](docs/test-strategy.md).

## How the tests are written

- **Expected values come from the API, not from the test file.** The shop's catalog can change, so a UI test asks the API what the product is called and what it costs, then checks the page against that.
- **Page objects stay small.** They hold locators and the few actions that need a wait, such as search. Assertions live in the tests.
- **Selectors use `data-test` attributes**, which the application provides for this purpose.
- **No fixed waits.** Tests wait for the network response or the element they depend on.

## Run it

```bash
npm ci
npx playwright install chromium
npx playwright test          # everything
npm run test:api             # API only
npm run test:ui              # UI only
npm run report               # open the HTML report
```

The sign-in test needs an account. Copy `.env.example` to `.env`, fill in one of the demo accounts the site documents, and export the variables before running. Without them the test is skipped.

## CI

GitHub Actions runs the type check and all tests on every push and pull request, and uploads the HTML report as an artifact. See [.github/workflows/tests.yml](.github/workflows/tests.yml).

## Next

- [ ] Sign-in and account flows, using a saved session
- [ ] Checkout as a guest, through to payment
- [ ] Filters by category and brand
- [ ] Publish the HTML report with GitHub Pages
