import { Pool } from 'pg';

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const databaseUrl = process.env.DATABASE_URL?.trim();

export const db = new Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: requiredEnv('DB_HOST'),
        port: Number(requiredEnv('DB_PORT')),
        database: requiredEnv('DB_NAME'),
        user: requiredEnv('DB_USER'),
        password: requiredEnv('DB_PASSWORD'),
        ssl: { rejectUnauthorized: false },
      }
);
