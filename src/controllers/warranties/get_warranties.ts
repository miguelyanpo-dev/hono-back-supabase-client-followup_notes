import { Context } from 'hono';
import { AliadoService } from '../../services/aliado.service';

export const getWarranties = async (c: Context) => {
  try {
    const query = c.req.query();

    const data = await AliadoService.getWarranties({
      page: query.page ? Number(query.page) : undefined,
      itemsPerPage: query.itemsPerPage ? Number(query.itemsPerPage) : undefined,
      identification: query.identification,
    });

    return c.json({
      success: true,
      data,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Error al obtener garantias',
      message: String(error),
    }, 500);
  }
};
