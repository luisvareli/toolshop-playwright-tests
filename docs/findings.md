# Findings

Things the suite turned up while it was being written. Each one is either a defect, an inconsistency worth knowing about, or a test-design lesson.

| # | Area | What I saw | Status |
| --- | --- | --- | --- |
| 1 | Routing | Opening `/checkout` or `/category/hand-tools` by URL worked locally but rendered without its data in GitHub Actions: the cart was empty and the category heading was missing. Reaching the same pages through the menu works in both places. | Open. Cause not found yet. Tests navigate through the menu. |
| 2 | API contract | A product embeds its brand as `{ id, name }`, while `/brands` returns `{ id, name, slug }`. A client that expects the slug on a product will break. | Documented in `src/api/schemas.ts`. |
| 3 | Mobile layout | On phone-sized screens the cart link sits inside the collapsed menu, so a test that clicks it directly times out. | Not a defect. `CheckoutPage.open()` opens the menu first. |
| 4 | Accessibility | axe found no serious or critical WCAG 2 A/AA violations on the home, contact and sign-in pages. | Baseline is empty. Any new violation fails the suite. |

## How to add a finding

Write what you saw, where, and how to see it again. If a test had to change because of it, say which one. If it is a known issue the suite should tolerate for now, add the rule or case to the relevant baseline and link it here.
