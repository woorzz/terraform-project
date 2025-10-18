import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "appdb",
    user: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "apppass",
});

export async function query(sql, params = []) {
    const client = await pool.connect();
    try {
        return await client.query(sql, params);
    } finally {
        client.release();
    }
}

export async function pingDb() {
    const res = await query("SELECT 1 as ok");
    return res.rows[0]?.ok === 1;
}
