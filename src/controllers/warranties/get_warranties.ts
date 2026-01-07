import { Context } from 'hono';
import { WarrantiesService } from '../../services/warranties.service';
import { GetWarrantiesQuerySchema } from '../../schemas/warranties.schemas';
import { getDb } from '../../config/db';

export const getWarranties = async (c: Context) => {
  // 1️⃣ ref obligatorio
  const ref = c.req.query('ref')?.trim();

  if (!ref) {
    return c.json(
      { success: false, error: 'Not Found', message: 'Database ref is required' },
      404
    );
  }

  // 2️⃣ conexión DB basada solo en ref
  const db = getDb(ref);

  // 3️⃣ construir query sin incluir ref
  const url = new URL(c.req.url);
  const queryObj: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    if (key !== 'ref') {
      queryObj[key] = value;
    }
  });

  // 4️⃣ validar filtros con Zod
  const parsed = GetWarrantiesQuerySchema.safeParse(queryObj);
  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Bad Request',
        message: parsed.error.message,
      },
      400
    );
  }

  // 5️⃣ paginación segura
  const page = Math.max(1, Number(parsed.data.page ?? 1));
  const limitRequested = Number(parsed.data.limit ?? 20);
  const limit = Math.min(20, Math.max(1, limitRequested));

  // 6️⃣ llamada al servicio
  const { rows, total } = await WarrantiesService.getPaginated(db, {
    page,
    limit,
    customer_name: parsed.data.customer_name,
    customer_identification: parsed.data.customer_identification,
    seller_id: parsed.data.seller_id,
    status: parsed.data.status,
    date_start: parsed.data.date_start,
    date_end: parsed.data.date_end,
  });

  // 7️⃣ metadata de paginación
  const pageTotal = total === 0 ? 0 : Math.ceil(total / limit);
  const pageCurrent = pageTotal === 0 ? 1 : Math.min(page, pageTotal);

  // 8️⃣ respuesta final
  return c.json({
    success: true,
    data: rows,
    data_items: rows.length,
    page_current: pageCurrent,
    page_total: pageTotal,
    have_next_page: pageCurrent < pageTotal,
    have_previous_page: pageCurrent > 1,
  });
};
