import { z } from 'zod';

/**
 * ============================
 * CREATE
 * ============================
 */
export const CreateClientFollowupNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tag: z.string().optional(),
  file_url: z.string().optional().nullable(),
  client_id: z.string().min(1, 'Client ID is required'),
  
  // Auditoría de creación
  created_by_user_id: z.string().min(1, 'Created by user ID is required'),
  created_by_user_name: z.string().min(1, 'Created by user name is required'),
  created_by_user_image: z.string().optional().nullable(),
});

/**
 * ============================
 * UPDATE
 * ============================
 */
export const UpdateClientFollowupNoteSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tag: z.string().optional(),
  file_url: z.string().optional().nullable(),
  
  // Auditoría de actualización
  updated_by_user_id: z.string().min(1, 'Updated by user ID is required'),
  updated_by_user_name: z.string().min(1, 'Updated by user name is required'),
  updated_by_user_image: z.string().optional().nullable(),
});

/**
 * ============================
 * QUERY PARAMS
 * ============================
 */
export const GetClientFollowupNotesQuerySchema = z.object({
  ref: z.string().min(1, 'ref is required'),

  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional().refine(
    (val) => {
      if (val === undefined) return true;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return num >= 1 && num <= 1000;
    },
    { message: 'Limit must be between 1 and 1000' }
  ),

  client_id: z.string().optional(),
  clients_ids: z.union([z.string(), z.array(z.string())]).optional(),
  tag: z.string().optional(),
  created_by_user_id: z.string().optional(),

  date_start: z.string().optional(), // ISO
  date_end: z.string().optional(),   // ISO
});

/**
 * ============================
 * RESPONSE
 * ============================
 */
export const PaginatedClientFollowupNotesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  data_items: z.number(),
  page_current: z.number(),
  page_total: z.number(),
  have_next_page: z.boolean(),
  have_previus_page: z.boolean(),
});