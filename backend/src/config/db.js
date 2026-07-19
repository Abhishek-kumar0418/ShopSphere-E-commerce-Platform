import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Abhi@99",
  database: process.env.DB_NAME || "commerce_db",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: false
});

export async function query(sql, params = []) {
  const { sql: mysqlSql, params: mysqlParams } = normalize(sql, params);
  const [rows] = await pool.query(mysqlSql, mysqlParams);
  return { rows };
}

export async function transaction(work) {
  const client = await pool.getConnection();
  const wrappedClient = {
    async query(sql, params = []) {
      const { sql: mysqlSql, params: mysqlParams } = normalize(sql, params);
      const [rows] = await client.query(mysqlSql, mysqlParams);
      return { rows };
    }
  };
  try {
    await client.beginTransaction();
    const result = await work(wrappedClient);
    await client.commit();
    return result;
  } catch (error) {
    await client.rollback();
    throw error;
  } finally {
    client.release();
  }
}

export function normalize(sql, params = []) {
  const mysqlParams = [];
  const mysqlSql = sql.replace(/\$(\d+)/g, (_, index) => {
    mysqlParams.push(params[Number(index) - 1]);
    return "?";
  });
  return { sql: mysqlSql, params: mysqlParams.length ? mysqlParams : params };
}
