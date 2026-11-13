import { test, expect } from '@playwright/test';

test.describe('Catalog API', () => {
  test('lists brands with id, name and slug', async ({ request }) => {
    const res = await request.get('/brands');
    expect(res.status()).toBe(200);

    const brands = await res.json();
    expect(brands.length).toBeGreaterThan(0);
    for (const brand of brands) {
      expect(brand).toEqual(
        expect.objectContaining({ id: expect.any(String), name: expect.any(String), slug: expect.any(String) }),
      );
    }
  });

  test('category tree nests sub-categories under their parent', async ({ request }) => {
    const res = await request.get('/categories/tree');
    expect(res.status()).toBe(200);

    const tree = await res.json();
    const handTools = tree.find((c: { slug: string }) => c.slug === 'hand-tools');
    expect(handTools, 'Hand Tools category').toBeTruthy();
    expect(handTools.parent_id).toBeNull();
    expect(handTools.sub_categories.length).toBeGreaterThan(0);
    for (const sub of handTools.sub_categories) {
      expect(sub.parent_id).toBe(handTools.id);
    }
  });

  test('the account endpoint rejects a request without a token', async ({ request }) => {
    const res = await request.get('/users/me');
    expect(res.status()).toBe(401);
  });
});
