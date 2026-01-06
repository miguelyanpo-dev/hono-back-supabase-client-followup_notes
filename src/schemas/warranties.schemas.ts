import { z } from 'zod';

export const CreateWarrantySchema = z.object({
  customer_id: z.string(),
  customer_name: z.string(),
  customer_identification: z.union([z.number(), z.string()]),
  customer_email: z.string().email().nullable().optional(),
  customer_cellphone: z.string().nullable().optional(),

  seller_id: z.string(),
  seller_name: z.string(),

  status: z.string(),
  is_active: z.boolean(),

  products_relation_ids: z.array(z.string()).optional(),
  notes_relation_ids: z.array(z.string()).optional(),

  user_created_name: z.string().optional(),
  user_created_id: z.string().optional(),
});

export const UpdateWarrantySchema = CreateWarrantySchema.partial().extend({
  customer_email: z.string().email().nullable().optional(),
  customer_cellphone: z.string().nullable().optional(),
  user_updated_name: z.string().optional(),
  user_updated_id: z.string().optional(),
});

export const GetWarrantiesQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
  customer_name: z.string().optional(),
  customer_identification: z.union([z.string(), z.number()]).optional(),
  seller_id: z.string().optional(),
  status: z.string().optional(),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
});

export const PaginatedWarrantiesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  data_items: z.number(),
  page_current: z.number(),
  page_total: z.number(),
  have_next_page: z.boolean(),
  have_previus_page: z.boolean(),
});
