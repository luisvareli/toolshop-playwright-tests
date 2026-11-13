import { test, expect } from '../../src/fixtures';
import { money } from '../../src/pages/checkout.page';

const guest = { email: 'qa.guest@example.com', firstName: 'Test', lastName: 'Buyer' };
const address = { countryCode: 'CR', postalCode: '10101', houseNumber: '12', street: 'Avenida Central', city: 'San Jose', state: 'San Jose' };

test.describe('Checkout', () => {
  test('a guest can buy a product and pay on delivery', { tag: '@smoke' }, async ({ productPage, checkoutPage, request, apiUrl }) => {
    const list = await (await request.get(`${apiUrl}/products?page=1`)).json();
    const product = list.data.find((p: { in_stock: boolean; is_rental: boolean }) => p.in_stock && !p.is_rental);

    await test.step('add the product to the cart', async () => {
      await productPage.open(product.id);
      await productPage.addToCart.click();
      await expect(productPage.cartBadge).toHaveText('1');
    });

    await test.step('review the cart', async () => {
      await checkoutPage.open();
      await expect(checkoutPage.productTitles).toHaveText([product.name]);
      expect(Math.round(money(await checkoutPage.total.innerText()) * 100)).toBe(Math.round(product.price * 100));
      await checkoutPage.proceedFromCart();
    });

    await test.step('continue as a guest and enter the address', async () => {
      await checkoutPage.continueAsGuest(guest);
      await checkoutPage.fillAddress(address);
    });

    await test.step('pay', async () => {
      await checkoutPage.pay('Cash on Delivery');
      await expect(checkoutPage.paymentSuccess).toHaveText('Payment was successful');
    });
  });

  test('the address step blocks progress until required fields are filled', async ({ page, productPage, checkoutPage, request, apiUrl }) => {
    const list = await (await request.get(`${apiUrl}/products?page=1`)).json();
    const product = list.data.find((p: { in_stock: boolean; is_rental: boolean }) => p.in_stock && !p.is_rental);

    await productPage.open(product.id);
    await productPage.addToCart.click();
    await expect(productPage.cartBadge).toHaveText('1');
    await checkoutPage.open();
    await checkoutPage.proceedFromCart();
    await checkoutPage.continueAsGuest(guest);

    await expect(page.getByTestId('proceed-3')).toBeDisabled();
  });
});
