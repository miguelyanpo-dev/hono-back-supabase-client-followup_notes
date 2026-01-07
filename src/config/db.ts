import { Pool } from 'pg';

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

let localDatabaseUrl: string | undefined;
try {
  const secrets = require('./secrets.local') as { LOCAL_DATABASE_URL?: string };
  localDatabaseUrl = secrets.LOCAL_DATABASE_URL?.trim();
} catch {
  localDatabaseUrl = undefined;
}

const databaseUrl = process.env.DATABASE_URL?.trim() || localDatabaseUrl;

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
