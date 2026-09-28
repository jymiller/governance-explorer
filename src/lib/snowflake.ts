import snowflake from "snowflake-sdk";
import fs from "fs";
import path from "path";

let pool: snowflake.Connection | null = null;

function getPrivateKey(): string | undefined {
  // SNOWFLAKE_PRIVATE_KEY: the key contents as a string (for Vercel/hosted)
  if (process.env.SNOWFLAKE_PRIVATE_KEY) {
    return process.env.SNOWFLAKE_PRIVATE_KEY;
  }
  // SNOWFLAKE_PRIVATE_KEY_PATH: path to the key file (for local dev)
  if (process.env.SNOWFLAKE_PRIVATE_KEY_PATH) {
    const keyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH;
    return fs.readFileSync(
      keyPath.startsWith("~")
        ? path.join(process.env.HOME || "", keyPath.slice(1))
        : keyPath,
      "utf-8"
    );
  }
  return undefined;
}

function getConnection(): Promise<snowflake.Connection> {
  if (pool && pool.isUp()) {
    return Promise.resolve(pool);
  }

  const account = process.env.SNOWFLAKE_ACCOUNT!;
  const username = process.env.SNOWFLAKE_USER!;
  const warehouse = process.env.SNOWFLAKE_WAREHOUSE || "COMPUTE_WH";
  const database = process.env.SNOWFLAKE_DATABASE || "GOVERNANCE_EXPLORER";

  const options: snowflake.ConnectionOptions = {
    account,
    username,
    warehouse,
    database,
  };

  const privateKey = getPrivateKey();
  if (privateKey) {
    options.authenticator = "SNOWFLAKE_JWT";
    options.privateKey = privateKey;
  } else if (process.env.SNOWFLAKE_PASSWORD) {
    options.password = process.env.SNOWFLAKE_PASSWORD;
  }

  return new Promise((resolve, reject) => {
    const conn = snowflake.createConnection(options);
    conn.connect((err, c) => {
      if (err) reject(err);
      else {
        pool = c;
        resolve(c);
      }
    });
  });
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  binds?: snowflake.Binds
): Promise<T[]> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) reject(err);
        else resolve((rows as T[]) || []);
      },
    });
  });
}

export async function getDatabases(): Promise<string[]> {
  const rows = await query<{ name: string }>("SHOW DATABASES");
  return rows.map((r) => r.name);
}

export async function getSchemas(database: string): Promise<string[]> {
  const rows = await query<{ name: string }>(
    `SHOW SCHEMAS IN DATABASE IDENTIFIER(?)`,
    [database]
  );
  return rows
    .map((r) => r.name)
    .filter((n) => n !== "INFORMATION_SCHEMA");
}

export async function getTables(
  database: string,
  schema: string
): Promise<string[]> {
  const rows = await query<{ name: string }>(
    `SHOW TABLES IN SCHEMA IDENTIFIER(?)`,
    [`${database}.${schema}`]
  );
  return rows.map((r) => r.name);
}

export async function classifyTable(
  database: string,
  schema: string,
  table: string
): Promise<Record<string, unknown>> {
  const fqn = `${database}.${schema}.${table}`;
  const rows = await query<{ CLASSIFY: string }>(
    `SELECT SYSTEM$CLASSIFY('${fqn}') AS CLASSIFY`
  );
  return JSON.parse(rows[0]?.CLASSIFY || "{}");
}
