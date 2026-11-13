import { z } from 'zod';

/** Contracts the shop front end relies on. A breaking API change fails here first. */

export const BrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  parent_id: z.string().nullable().optional(),
});

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  is_location_offer: z.boolean(),
  is_rental: z.boolean(),
  in_stock: z.boolean(),
  product_image: z.object({ file_name: z.string().min(1) }).passthrough().nullable(),
  category: CategorySchema.passthrough(),
  // The embedded brand is a summary: the list endpoint returns the slug, the product does not.
  brand: BrandSchema.pick({ id: true, name: true }).passthrough(),
});

export const ProductPageSchema = z.object({
  current_page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  last_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  data: z.array(ProductSchema),
});

export type Product = z.infer<typeof ProductSchema>;
