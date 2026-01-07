import type { Pool } from 'pg';

export class WarrantiesService {

  // ⚠️ Opcional / prescindible
  static async getAll(db: Pool) {
    const { rows } = await db.query(
      `
      SELECT *
      FROM warranties
      ORDER BY user_created_date DESC
      `
    );
    return rows;
  }

  static async getPaginated(
    db: Pool,
    filters: {
      page: number;
      limit: number;
      customer_name?: string;
      customer_identification?: string | number;
      seller_id?: string;
      status?: string;
      date_start?: string;
      date_end?: string;
    }
  ) {
    const where: string[] = [];
    const values: any[] = [];

    if (filters.customer_name) {
      values.push(`%${filters.customer_name}%`);
      where.push(`customer_name ILIKE $${values.length}`);
    }

    if (filters.customer_identification !== undefined) {
      values.push(String(filters.customer_identification));
      where.push(`customer_identification = $${values.length}`);
    }

    if (filters.seller_id) {
      values.push(filters.seller_id);
      where.push(`seller_id = $${values.length}`);
    }

    if (filters.status) {
      values.push(filters.status);
      where.push(`status = $${values.length}`);
    }

    if (filters.date_start) {
      values.push(filters.date_start);
      where.push(`user_created_date >= $${values.length}::timestamptz`);
    }

    if (filters.date_end) {
      values.push(filters.date_end);
      where.push(`user_created_date <= $${values.length}::timestamptz`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*)::bigint AS total
      FROM warranties
      ${whereSql}
    `;
    const countResult = await db.query(countQuery, values);
    const total = Number(countResult.rows?.[0]?.total ?? 0);

    const offset = (filters.page - 1) * filters.limit;
    const valuesWithPaging = [...values, filters.limit, offset];

    const dataQuery = `
      SELECT *
      FROM warranties
      ${whereSql}
      ORDER BY user_created_date DESC
      LIMIT $${valuesWithPaging.length - 1}
      OFFSET $${valuesWithPaging.length}
    `;

    const { rows } = await db.query(dataQuery, valuesWithPaging);
    return { rows, total };
  }

  static async getById(db: Pool, id: number) {
    const { rows } = await db.query(
      `SELECT * FROM warranties WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  static async create(db: Pool, data: any) {
    const { rows } = await db.query(
      `
      INSERT INTO warranties (
        customer_id,
        customer_name,
        customer_identification,
        customer_email,
        customer_cellphone,
        seller_id,
        seller_name,
        status,
        is_active,
        products_relation_ids,
        notes_relation_ids,
        user_created_date,
        user_created_name,
        user_created_id,
        user_created_img
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,
        $10,$11,
        now(),$12,$13,$14
      )
      RETURNING *
      `,
      [
        data.customer_id,
        data.customer_name,
        data.customer_identification,
        data.customer_email ?? null,
        data.customer_cellphone ?? null,
        data.seller_id,
        data.seller_name,
        data.status,
        data.is_active,
        data.products_relation_ids ?? null,
        data.notes_relation_ids ?? null,
        data.user_created_name,
        data.user_created_id,
        data.user_created_img ?? null,
      ]
    );

    return rows[0];
  }

  static async update(db: Pool, id: number, data: any) {
    const isStatusUpdate = data.status !== undefined;

    const { rows } = await db.query(
      `
      UPDATE warranties
      SET
        customer_name = COALESCE($1, customer_name),
        customer_identification = COALESCE($2, customer_identification),
        customer_email = COALESCE($3, customer_email),
        customer_cellphone = COALESCE($4, customer_cellphone),
        seller_id = COALESCE($5, seller_id),
        seller_name = COALESCE($6, seller_name),
        status = COALESCE($7, status),
        is_active = COALESCE($8, is_active),
        products_relation_ids = COALESCE($9, products_relation_ids),
        notes_relation_ids = COALESCE($10, notes_relation_ids),

        user_updated_date = now(),
        user_updated_name = COALESCE($11, user_updated_name),
        user_updated_id = COALESCE($12, user_updated_id),
        user_updated_img = COALESCE($13, user_updated_img),

        user_updated_status_date = CASE WHEN $14 THEN now() ELSE user_updated_status_date END,
        user_updated_status_name = CASE WHEN $14 THEN $11 ELSE user_updated_status_name END,
        user_updated_status_id = CASE WHEN $14 THEN $12 ELSE user_updated_status_id END,
        user_updated_status_img = CASE WHEN $14 THEN $13 ELSE user_updated_status_img END

      WHERE id = $15
      RETURNING *
      `,
      [
        data.customer_name ?? null,
        data.customer_identification ?? null,
        data.customer_email ?? null,
        data.customer_cellphone ?? null,
        data.seller_id ?? null,
        data.seller_name ?? null,
        data.status ?? null,
        data.is_active ?? null,
        data.products_relation_ids ?? null,
        data.notes_relation_ids ?? null,
        data.user_updated_name,
        data.user_updated_id,
        data.user_updated_img ?? null,
        isStatusUpdate,
        id,
      ]
    );

    return rows[0];
  }

  static async deactivate(
    db: Pool,
    id: number,
    userUpdated?: {
      user_updated_name?: string;
      user_updated_id?: string;
      user_updated_img?: string;
    }
  ) {
    const { rows } = await db.query(
      `
      UPDATE warranties
      SET
        is_active = false,
        user_updated_date = now(),
        user_updated_name = COALESCE($1, user_updated_name),
        user_updated_id = COALESCE($2, user_updated_id),
        user_updated_img = COALESCE($3, user_updated_img)
      WHERE id = $4
      RETURNING *
      `,
      [
        userUpdated?.user_updated_name ?? null,
        userUpdated?.user_updated_id ?? null,
        userUpdated?.user_updated_img ?? null,
        id,
      ]
    );

    return rows[0];
  }
}
