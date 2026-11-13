import { test as base } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { ProductPage } from './pages/product.page';
import { CheckoutPage } from './pages/checkout.page';

type Pages = {
  homePage: HomePage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  apiUrl: string;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  // UI tests read expected data from the API instead of hard-coding it.
  apiUrl: async ({}, use, testInfo) => use(String(testInfo.config.metadata.apiUrl)),
});

export { expect } from '@playwright/test';
