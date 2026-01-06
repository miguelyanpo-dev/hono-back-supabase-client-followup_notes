import { Context } from 'hono/dist/types/context';
import { CreateWarrantySchema } from '../../schemas/warranties.schemas';
import { WarrantiesService } from '../../services/warranties.service';

export const createWarranty = async (c: Context) => {
  const body = await c.req.json().catch(() => null);
  const parsed = CreateWarrantySchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsed.error.message },
      400
    );
  }

  const data = await WarrantiesService.create(parsed.data);
  return c.json({ success: true, data }, 201);
};
