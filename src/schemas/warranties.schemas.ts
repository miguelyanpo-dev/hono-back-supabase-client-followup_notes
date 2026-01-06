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
