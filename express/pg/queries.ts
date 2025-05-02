import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydb',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})

const getUsers = (request :any, response :any) => {
    pool.query('SELECT * FROM t', (error: any, results: { rows: any }) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

async function testDbConnection() {
    try {
        // Try to connect and query
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected successfully:', res.rows[0]);

        // Close the pool after the query
        pool.end();
    } catch (err) {
        console.error('Error connecting to the database:', err);
        pool.end();
    }
}

// Run the test
testDbConnection();

export {getUsers};
