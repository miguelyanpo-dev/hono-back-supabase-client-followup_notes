import { Context } from 'hono';
import { WarrantiesService } from '../../services/warranties.service';

export const getWarrantyById = async (c: Context) => {
  const idParam = c.req.param('id');
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    return c.json(
      { success: false, error: 'Bad Request', message: 'Invalid id' },
      400
    );
  }

  const data = await WarrantiesService.getById(id);
  if (!data) {
    return c.json(
      { success: false, error: 'Not Found', message: 'Warranty not found' },
      404
    );
  }

  return c.json({ success: true, data });
};
