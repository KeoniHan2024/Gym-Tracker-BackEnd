const mysql = require('mysql2');

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise();
    
export async function queryDatabase(sql: string, params?: any[]) {
    try {
        const result = await pool.query(sql, params);
        const rows = result[0];
        return rows;
    }
    catch (error) {
        throw error;
    }
} 

export function closePool() {
    pool.end();
}

