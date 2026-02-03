import { Context } from 'hono/dist/types/context';
import { CreateClientFollowupNoteSchema } from '../../schemas/client_followup_notes.schemas';
import { ClientFollowupNotesService } from '../../services/client_followup_notes.service';
import { getDb } from '../../config/db';

export const createClientFollowupNote = async (c: Context) => {
  const ref = c.req.query('ref')?.trim();
  if (ref && process.env.NODE_ENV === 'production' && process.env.ENABLE_DB_REF !== 'true') {
    return c.json({ success: false, error: 'Not Found' }, 404);
  }
  const db = getDb(ref);

  const body = await c.req.json().catch(() => null);
  const parsed = CreateClientFollowupNoteSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsed.error.message },
      400
    );
  }

  const data = await ClientFollowupNotesService.create(db, parsed.data);
  return c.json({ success: true, data }, 201);
};