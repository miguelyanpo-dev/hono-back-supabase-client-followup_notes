import type { Pool } from 'pg';

export class ClientFollowupNotesService {
  // Obtener todas las notas (opcional / prescindible)
  static async getAll(db: Pool) {
    const { rows } = await db.query(
      `
      SELECT *
      FROM client_followup_notes
      ORDER BY created_at DESC
      `
    );
    return rows;
  }

  // Obtener notas paginadas con filtros
  static async getPaginated(
    db: Pool,
    filters: {
      page: number;
      limit: number;
      client_id?: string;
      clients_ids?: string[];
      tag?: string;
      created_by_user_id?: string;
      created_by_user_email?: string;
      client_name?: string;
      date_start?: string;
      date_end?: string;
    }
  ) {
    const where: string[] = [];
    const values: any[] = [];

    if (filters.client_id) {
      values.push(filters.client_id);
      where.push(`client_id = $${values.length}`);
    }

    if (filters.clients_ids && filters.clients_ids.length > 0) {
      values.push(filters.clients_ids);
      where.push(`client_id = ANY($${values.length})`);
    }

    if (filters.tag) {
      values.push(`%${filters.tag}%`);
      where.push(`tag ILIKE $${values.length}`);
    }

    if (filters.created_by_user_id) {
      values.push(filters.created_by_user_id);
      where.push(`created_by_user_id = $${values.length}`);
    }

    if (filters.created_by_user_email) {
      values.push(filters.created_by_user_email);
      where.push(`created_by_user_email = $${values.length}`);
    }

    if (filters.client_name) {
      values.push(`%${filters.client_name}%`);
      where.push(`client_name ILIKE $${values.length}`);
    }

    if (filters.date_start) {
      values.push(filters.date_start);
      where.push(`created_at >= $${values.length}::timestamptz`);
    }

    if (filters.date_end) {
      values.push(filters.date_end);
      where.push(`created_at <= $${values.length}::timestamptz`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*)::bigint AS total
      FROM client_followup_notes
      ${whereSql}
    `;
    const countResult = await db.query(countQuery, values);
    const total = Number(countResult.rows?.[0]?.total ?? 0);

    const offset = (filters.page - 1) * filters.limit;
    const valuesWithPaging = [...values, filters.limit, offset];

    const dataQuery = `
      SELECT *
      FROM client_followup_notes
      ${whereSql}
      ORDER BY updated_at DESC, created_at DESC
      LIMIT $${valuesWithPaging.length - 1}
      OFFSET $${valuesWithPaging.length}
    `;

    const { rows } = await db.query(dataQuery, valuesWithPaging);
    return { rows, total };
  }

  // Obtener nota por ID
  static async getById(db: Pool, id: number) {
    const { rows } = await db.query(
      `SELECT * FROM client_followup_notes WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  // Crear nueva nota
  static async create(db: Pool, data: any) {
    const { rows } = await db.query(
      `
      INSERT INTO client_followup_notes (
        title,
        description,
        tag,
        file_url,
        client_id,
        client_name,
        created_by_user_id,
        created_by_user_name,
        created_by_user_image,
        created_by_user_email,
        updated_by_user_id,
        updated_by_user_name,
        updated_by_user_image
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $7, $8, $9
      )
      RETURNING *
      `,
      [
        data.title,
        data.description,
        data.tag ?? null,
        data.file_url ?? null,
        data.client_id,
        data.client_name,
        data.created_by_user_id,
        data.created_by_user_name,
        data.created_by_user_image ?? null,
        data.created_by_user_email ?? null,
      ]
    );

    return rows[0];
  }

  // Actualizar nota
  static async update(db: Pool, id: number, data: any) {
    const { rows } = await db.query(
      `
      UPDATE client_followup_notes
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        tag = COALESCE($3, tag),
        file_url = COALESCE($4, file_url),
        updated_at = now(),
        updated_by_user_id = COALESCE($5, updated_by_user_id),
        updated_by_user_name = COALESCE($6, updated_by_user_name),
        updated_by_user_image = COALESCE($7, updated_by_user_image)
      WHERE id = $8
      RETURNING *
      `,
      [
        data.title ?? null,
        data.description ?? null,
        data.tag ?? null,
        data.file_url ?? null,
        data.updated_by_user_id,
        data.updated_by_user_name,
        data.updated_by_user_image ?? null,
        id,
      ]
    );

    return rows[0];
  }

  // Eliminar nota (soft delete - desactivar)
  static async deactivate(
    db: Pool,
    id: number,
    userUpdated?: {
      updated_by_user_name?: string;
      updated_by_user_id?: string;
      updated_by_user_image?: string;
    }
  ) {
    const { rows } = await db.query(
      `
      UPDATE client_followup_notes
      SET
        updated_at = now(),
        updated_by_user_id = COALESCE($1, updated_by_user_id),
        updated_by_user_name = COALESCE($2, updated_by_user_name),
        updated_by_user_image = COALESCE($3, updated_by_user_image)
      WHERE id = $4
      RETURNING *
      `,
      [
        userUpdated?.updated_by_user_id ?? null,
        userUpdated?.updated_by_user_name ?? null,
        userUpdated?.updated_by_user_image ?? null,
        id,
      ]
    );

    return rows[0];
  }

  // Obtener estadísticas de notas por día (últimos 30 días)
  static async getDailyStats(
  db: Pool,
  filters: {
    client_id?: string;
    clients_ids?: string[];
    tag?: string;
    created_by_user_email?: string;
    client_name?: string;
  }
) {
  const where: string[] = [];
  const values: any[] = [];

  if (filters.client_id) {
    values.push(filters.client_id);
    where.push(`client_id = $${values.length}`);
  }

  if (filters.clients_ids && filters.clients_ids.length > 0) {
    values.push(filters.clients_ids);
    where.push(`client_id = ANY($${values.length})`);
  }

  if (filters.tag) {
    values.push(`%${filters.tag}%`);
    where.push(`tag ILIKE $${values.length}`);
  }

  if (filters.created_by_user_email) {
    values.push(filters.created_by_user_email);
    where.push(`created_by_user_email = $${values.length}`);
  }

  if (filters.client_name) {
    values.push(`%${filters.client_name}%`);
    where.push(`client_name ILIKE $${values.length}`);
  }

  // 🔥 SIEMPRE agregamos el filtro de fecha al array
  where.push(`created_at >= CURRENT_DATE - INTERVAL '29 days'`);
  where.push(`created_at < CURRENT_DATE + INTERVAL '1 day'`);

  const whereSql = `WHERE ${where.join(' AND ')}`;

  const query = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total
    FROM client_followup_notes
    ${whereSql}
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `;

  const { rows } = await db.query(query, values);

  const stats: any = {};
const today = new Date();
today.setHours(0, 0, 0, 0);

// Convertimos resultados a mapa
const map = new Map<string, number>();

rows.forEach(row => {
  const rowDate = new Date(row.date);
  const rowDateStr = rowDate.toISOString().split('T')[0];
  map.set(rowDateStr, parseInt(row.total));
});

const monthShort = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

for (let i = 0; i < 30; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() - i);

  const dateStr = date.toISOString().split('T')[0];
  const total = map.get(dateStr) ?? 0;

  if (i === 0) {
    stats["Hoy"] = total;
  } else {
    const label = `${monthShort[date.getMonth()]} ${date.getDate()}`;
    stats[label] = total;
  }
}

return stats;
}
  // Obtener estadísticas mensuales del año actual
  static async getMonthlyStats(
  db: Pool,
  filters: {
    client_id?: string;
    clients_ids?: string[];
    tag?: string;
    created_by_user_email?: string;
    client_name?: string;
  }
) {
  const where: string[] = [];
  const values: any[] = [];

  if (filters.client_id) {
    values.push(filters.client_id);
    where.push(`client_id = $${values.length}`);
  }

  if (filters.clients_ids && filters.clients_ids.length > 0) {
    values.push(filters.clients_ids);
    where.push(`client_id = ANY($${values.length})`);
  }

  if (filters.tag) {
    values.push(`%${filters.tag}%`);
    where.push(`tag ILIKE $${values.length}`);
  }

  if (filters.created_by_user_email) {
    values.push(filters.created_by_user_email);
    where.push(`created_by_user_email = $${values.length}`);
  }

  if (filters.client_name) {
    values.push(`%${filters.client_name}%`);
    where.push(`client_name ILIKE $${values.length}`);
  }

  // 🔥 Filtro del año SIEMPRE dentro del array
  where.push(`EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`);

  const whereSql = `WHERE ${where.join(' AND ')}`;

  const query = `
    SELECT 
      EXTRACT(MONTH FROM created_at) as month,
      COUNT(*) as total
    FROM client_followup_notes
    ${whereSql}
    GROUP BY EXTRACT(MONTH FROM created_at)
    ORDER BY month
  `;

  const { rows } = await db.query(query, values);

  const stats: any = {};
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  monthNames.forEach(month => {
  stats[month] = 0;
});

// Actualizar con valores reales
rows.forEach(row => {
  const monthIndex = parseInt(row.month) - 1;
  const monthName = monthNames[monthIndex];
  stats[monthName] = parseInt(row.total);
});

  return stats;
}
}
