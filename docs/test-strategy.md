# Test strategy

## Goal

Catch the failures that would cost a shop money or trust first: a customer cannot find a product, sees the wrong price, or is charged the wrong amount.

## What I test first, and why

| Risk | Why it matters | Where it is tested |
| --- | --- | --- |
| Wrong price or total | Direct money impact | `tests/ui/cart.spec.ts` |
| Search returns the wrong products | Customers cannot buy what they cannot find | `tests/ui/search-and-sort.spec.ts`, `tests/api/products.spec.ts` |
| UI and API disagree | Shows stale or wrong data to the customer | UI tests that read expected values from the API |
| Forms accept empty input | Bad data reaches the back end | `tests/ui/forms.spec.ts` |
| Protected data is readable without signing in | Security | `tests/api/catalog.spec.ts` |

## API or UI?

A rule is tested at the API when it is about data: paging, search matching, status codes. It is tested in the UI when it is about what the customer sees or does: the cart badge, the checkout total, validation messages. Where both matter, the UI test uses the API as its source of expected values.

## What is left out for now

- **Payment and order completion.** Next on the list; it needs a signed-in or guest checkout flow.
- **Admin area.** Lower priority for a customer-facing risk view.
- **Other browsers and mobile sizes.** The suite runs on desktop Chromium only. Adding projects in `playwright.config.ts` is cheap once the flows are stable.
- **Visual and accessibility checks.**
- **Performance.**

## Known limits

- The site is a shared public demo. Its data resets and other people use it, so tests avoid depending on a fixed product id or a fixed number of results.
- The sign-in test is skipped unless credentials are set as environment variables.
