// Database configuration - supports both PostgreSQL (Neon) and MySQL
import { z } from 'zod';

export const dbConfigSchema = z.object({
  type: z.enum(['postgresql', 'mysql']),
  host: z.string(),
  port: z.number(),
  user: z.string(),
  password: z.string(),
  database: z.string(),
});

export type DBConfig = z.infer<typeof dbConfigSchema>;

export function getDatabaseConfig(): DBConfig {
  // Check if MySQL is configured
  const mysqlHost = process.env.MYSQL_HOST;
  const mysqlUser = process.env.MYSQL_USER;
  const mysqlPassword = process.env.MYSQL_PASSWORD;
  const mysqlDatabase = process.env.MYSQL_DATABASE;
  const mysqlPort = process.env.MYSQL_PORT;

  if (mysqlHost && mysqlUser && mysqlPassword && mysqlDatabase) {
    return {
      type: 'mysql',
      host: mysqlHost,
      port: parseInt(mysqlPort || '3306', 10),
      user: mysqlUser,
      password: mysqlPassword,
      database: mysqlDatabase,
    };
  }

  // Fall back to PostgreSQL (Neon)
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'No database configured. Set either DATABASE_URL (PostgreSQL) or MYSQL_* environment variables'
    );
  }

  // Parse DATABASE_URL for PostgreSQL
  const url = new URL(databaseUrl);
  return {
    type: 'postgresql',
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  };
}
