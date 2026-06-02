import "server-only";
import * as mariadb from "mariadb";

let pool: mariadb.Pool | null = null;

export function getPool(): mariadb.Pool {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 5,
    });
  }

  return pool;
}

export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const conn = await getPool().getConnection();

  try {
    const rows = await conn.query(sql, params);
    return rows as T[];
  } finally {
    conn.release();
  }
}

export const ctQuery = query;