import { getDatabaseConfig } from './db-config';
import * as schema from "@shared/schema";
import ws from "ws";
import { drizzle as drizzlePostgres } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { Pool, neonConfig } from '@neondatabase/serverless';
import mysql from 'mysql2/promise';

const dbConfig = getDatabaseConfig();

let db: any;

async function initializeDatabase() {
  if (dbConfig.type === 'mysql') {
    const pool = await mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    db = drizzleMysql({ client: pool, schema, mode: 'default' });
    console.log(`Connected to MySQL database at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  } else {
    neonConfig.webSocketConstructor = ws;

    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set for PostgreSQL. Did you forget to provision a database?",
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzlePostgres({ client: pool, schema });
    console.log(`Connected to PostgreSQL database via Neon`);
  }
  return db;
}

export const dbPromise = initializeDatabase();
export async function getDb() {
  return dbPromise;
}

// For backward compatibility during initialization
export { db };
