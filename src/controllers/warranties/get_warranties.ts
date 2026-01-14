import { Context } from 'hono';
import { WarrantiesService } from '../../services/warranties.service';
import { GetWarrantiesQuerySchema } from '../../schemas/warranties.schemas';
import { getDb } from '../../config/db';

export const getWarranties = async (c: Context) => {
  const query = c.req.query();

  // ref obligatorio
  if (!query.ref) {
    return c.json(
      { success: false, error: 'Not Found', message: 'ref is required' },
      404
    );
  }

  const parsed = GetWarrantiesQuerySchema.safeParse(query);
  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsed.error.message },
      400
    );
  }

  const db = getDb(parsed.data.ref);

  const page = Math.max(1, Number(parsed.data.page ?? 1));
  const limitRequested = Number(parsed.data.limit ?? 20);
  const limit = Math.min(20, Math.max(1, limitRequested));

  const { rows, total } = await WarrantiesService.getPaginated(db, {
    page,
    limit,
    customer_name: parsed.data.customer_name,
    customer_identification: parsed.data.customer_identification,
    seller_id: parsed.data.seller_id,
    status: parsed.data.status,
    is_active: parsed.data.is_active,
    date_start: parsed.data.date_start,
    date_end: parsed.data.date_end,
  });

  const pageTotal = total === 0 ? 0 : Math.ceil(total / limit);
  const pageCurrent = pageTotal === 0 ? 1 : Math.min(page, pageTotal);

  return c.json({
    success: true,
    data: rows,
    data_items: rows.length,
    page_current: pageCurrent,
    page_total: pageTotal,
    have_next_page: pageCurrent < pageTotal,
    have_previus_page: pageCurrent > 1,
  });
};
