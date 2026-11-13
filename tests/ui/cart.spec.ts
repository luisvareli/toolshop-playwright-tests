import { test, expect } from '../../src/fixtures';
import { money } from '../../src/pages/checkout.page';

test.describe('Cart', () => {
  test('product page shows the name and price the API has for it', async ({ productPage, request, apiUrl }) => {
    const list = await (await request.get(`${apiUrl}/products?page=1`)).json();
    const product = list.data.find((p: { in_stock: boolean }) => p.in_stock);

    await productPage.open(product.id);

    await expect(productPage.name).toHaveText(product.name);
    expect(money(await productPage.unitPrice.innerText())).toBe(product.price);
  });

  test('adding two units charges twice the unit price at checkout', async ({ productPage, checkoutPage, request, apiUrl }) => {
    const list = await (await request.get(`${apiUrl}/products?page=1`)).json();
    const product = list.data.find((p: { in_stock: boolean }) => p.in_stock);

    await productPage.open(product.id);
    await productPage.increaseQuantity.click();
    await expect(productPage.quantity).toHaveValue('2');
    await productPage.addToCart.click();
    await expect(productPage.cartBadge).toHaveText('2');

    await checkoutPage.open();

    await expect(checkoutPage.productTitles).toHaveText([product.name]);
    // Compare in cents to avoid floating point noise.
    const expectedCents = Math.round(product.price * 100) * 2;
    expect(Math.round(money(await checkoutPage.linePrices.first().innerText()) * 100)).toBe(expectedCents);
    expect(Math.round(money(await checkoutPage.total.innerText()) * 100)).toBe(expectedCents);
  });
});
