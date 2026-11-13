import { expect, type Locator, type Page } from '@playwright/test';

export type Guest = { email: string; firstName: string; lastName: string };
export type Address = { countryCode: string; postalCode: string; houseNumber: string; street: string; city: string; state: string };

export class CheckoutPage {
  readonly productTitles: Locator;
  readonly linePrices: Locator;
  readonly total: Locator;
  readonly paymentSuccess: Locator;

  constructor(private readonly page: Page) {
    this.productTitles = page.getByTestId('product-title');
    this.linePrices = page.getByTestId('line-price');
    this.total = page.getByTestId('cart-total');
    this.paymentSuccess = page.getByTestId('payment-success-message');
  }

  /** Opens the cart the way a customer does, from the cart icon in the menu. */
  async open() {
    const cart = this.page.getByTestId('nav-cart');
    // On phone-sized screens the menu is collapsed behind the toggle button.
    if (!(await cart.isVisible())) {
      await this.page.locator('.navbar-toggler').click();
    }
    await cart.click();
    await this.page.waitForURL('**/checkout');
  }

  async proceedFromCart() {
    await this.page.getByTestId('proceed-1').click();
  }

  async continueAsGuest(guest: Guest) {
    await this.page.getByRole('tab', { name: 'Continue as Guest' }).click();
    await this.page.getByTestId('guest-email').fill(guest.email);
    await this.page.getByTestId('guest-first-name').fill(guest.firstName);
    await this.page.getByTestId('guest-last-name').fill(guest.lastName);
    await this.page.getByTestId('guest-submit').click();
    await this.page.getByTestId('proceed-2-guest').click();
  }

  async fillAddress(address: Address) {
    await this.page.getByTestId('country').selectOption(address.countryCode);
    await this.page.getByTestId('postal_code').fill(address.postalCode);
    await this.page.getByTestId('house_number').fill(address.houseNumber);
    await this.page.getByTestId('street').fill(address.street);
    await this.page.getByTestId('city').fill(address.city);
    await this.page.getByTestId('state').fill(address.state);
    const next = this.page.getByTestId('proceed-3');
    await expect(next).toBeEnabled();
    await next.click();
  }

  async pay(method: string) {
    await this.page.getByTestId('payment-method').selectOption({ label: method });
    await this.page.getByTestId('finish').click();
  }
}

/** "$28.30" -> 28.3 */
export function money(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
