import { z } from 'zod';

/**
 * ============================
 * CREATE
 * ============================
 */
export const CreateWarrantySchema = z.object({
  customer_id: z.string(),
  customer_name: z.string(),
  customer_identification: z.union([z.number(), z.string()]),

  customer_email: z.string().email().nullable().optional(),
  customer_cellphone: z.string().nullable().optional(),

  seller_id: z.string(),
  seller_name: z.string(),

  status: z.string(),
  is_active: z.boolean().optional().default(true),

  products_relation_ids: z.array(z.string()).optional(),
  notes_relation_ids: z.array(z.string()).optional(),

  // ✅ SOLO auditoría de creación
  user_created_name: z.string(),
  user_created_id: z.string(),
  user_created_img: z.string().optional(),
});


/**
 * ============================
 * UPDATE
 * ============================
 */
export const UpdateWarrantySchema = z.object({
  customer_name: z.string().optional(),
  customer_identification: z.union([z.string(), z.number()]).optional(),
  customer_email: z.string().email().nullable().optional(),
  customer_cellphone: z.string().nullable().optional(),

  seller_id: z.string().optional(),
  seller_name: z.string().optional(),

  status: z.string().optional(),
  is_active: z.boolean().optional(),

  products_relation_ids: z.array(z.string()).optional(),
  notes_relation_ids: z.array(z.string()).optional(),

  // Auditoría update general
  user_updated_name: z.string(),
  user_updated_id: z.string(),
  user_updated_img: z.string().optional(),

  // Auditoría cambio de estado
  user_updated_status_date: z.string().optional(), // ISO string
  user_updated_status_name: z.string().optional(),
  user_updated_status_id: z.string().optional(),
  user_updated_status_img: z.string().optional(),
});

/**
 * ============================
 * QUERY PARAMS
 * ============================
 */
export const GetWarrantiesQuerySchema = z.object({
  ref: z.string().min(1, 'ref is required'),

  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),

  customer_name: z.string().optional(),
  customer_identification: z.union([z.string(), z.number()]).optional(),
  seller_id: z.string().optional(),
  status: z.string().optional(),
  is_active: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return undefined;
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const lower = val.toLowerCase();
        if (lower === 'true') return true;
        if (lower === 'false') return false;
      }
      return undefined;
    },
    z.boolean().optional()
  ),

  date_start: z.string().optional(), // ISO
  date_end: z.string().optional(),   // ISO
});

/**
 * ============================
 * RESPONSE
 * ============================
 */
export const PaginatedWarrantiesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  data_items: z.number(),
  page_current: z.number(),
  page_total: z.number(),
  have_next_page: z.boolean(),
  have_previus_page: z.boolean(),
});
