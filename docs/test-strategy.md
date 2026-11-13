# Test strategy

## Goal

Catch the failures that would cost a shop money or trust first: a customer cannot find a product, sees the wrong price, or is charged the wrong amount.

## What I test first, and why

| Risk | Why it matters | Where it is tested |
| --- | --- | --- |
| A customer cannot complete a purchase | Lost sale | `tests/ui/checkout.spec.ts`, also run on a phone-sized screen |
| Wrong price or total | Direct money impact | `tests/ui/cart.spec.ts` |
| Search returns the wrong products | Customers cannot buy what they cannot find | `tests/ui/search-and-sort.spec.ts`, `tests/api/products.spec.ts` |
| UI and API disagree | Shows stale or wrong data to the customer | UI tests that read expected values from the API |
| Forms accept empty input | Bad data reaches the back end | `tests/ui/forms.spec.ts` |
| Protected data is readable without signing in | Security | `tests/api/catalog.spec.ts` |
| The API changes shape without notice | Breaks the front end and every client | `tests/api/contract.spec.ts` |
| A page becomes unusable with a keyboard or screen reader | Excludes customers, legal exposure | `tests/a11y/accessibility.spec.ts` |

## API or UI?

A rule is tested at the API when it is about data: paging, search matching, status codes. It is tested in the UI when it is about what the customer sees or does: the cart badge, the checkout total, validation messages. Where both matter, the UI test uses the API as its source of expected values.

## What is left out for now

- **Card payments and order history.** Guest checkout with payment on delivery is covered; card details and the signed-in order history are not.
- **Admin area.** Lower priority for a customer-facing risk view.
- **Firefox and WebKit.** The suite runs on Chromium, at desktop and phone sizes.
- **Visual regression.**
- **Performance.**

## Known limits

- The site is a shared public demo. Its data resets and other people use it, so tests avoid depending on a fixed product id or a fixed number of results.
- The sign-in test is skipped unless credentials are set as environment variables.
