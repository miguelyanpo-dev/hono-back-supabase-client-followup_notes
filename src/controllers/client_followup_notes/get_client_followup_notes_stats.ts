import { Context } from 'hono/dist/types/context';
import { GetClientFollowupNotesQuerySchema } from '../../schemas/client_followup_notes.schemas';
import { ClientFollowupNotesService } from '../../services/client_followup_notes.service';
import { getDb } from '../../config/db';

export const getClientFollowupNotesStats = async (c: Context) => {
  const ref = c.req.query('ref')?.trim();
  if (ref && process.env.NODE_ENV === 'production' && process.env.ENABLE_DB_REF !== 'true') {
    return c.json({ success: false, error: 'Not Found' }, 404);
  }
  const db = getDb(ref);

  const query = c.req.query();
  
  // Convert clients_ids from comma-separated string to array if needed
  if (query.clients_ids && typeof query.clients_ids === 'string') {
    (query as any).clients_ids = query.clients_ids.split(',').map(id => id.trim());
  }
  
  const parsed = GetClientFollowupNotesQuerySchema.safeParse(query);

  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsed.error.message },
      400
    );
  }

  const filters = {
    client_id: parsed.data.client_id,
    clients_ids: parsed.data.clients_ids ? (Array.isArray(parsed.data.clients_ids) ? parsed.data.clients_ids : [parsed.data.clients_ids]) : undefined,
    tag: parsed.data.tag,
    created_by_user_email: parsed.data.created_by_user_email,
    client_name: parsed.data.client_name,
  };

  try {
    // Obtener estadísticas diarias y mensuales en paralelo
    const [dailyStats, monthlyStats] = await Promise.all([
      ClientFollowupNotesService.getDailyStats(db, filters),
      ClientFollowupNotesService.getMonthlyStats(db, filters)
    ]);

    const response = {
      success: true,
      data: {
        daily: dailyStats,
        monthly: monthlyStats
      }
    };

    return c.json(response, 200);
  } catch (error) {
    console.error('Error getting statistics:', error);
    return c.json(
      { success: false, error: 'Internal Server Error', message: 'Failed to get statistics' },
      500
    );
  }
};