import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma';

export const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydb',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})

// be sure to disconnect prisma when the server stops
// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
export const prisma = new PrismaClient();

export const query = (text :any, params :any) => {
    return pool.query(text, params)
}

// async function testDbConnection() {
//     try {
//         // Try to connect and query
//         const res = await pool.query('SELECT NOW()');
//         console.log('Database connected successfully:', res.rows[0]);
//
//         // Close the pool after the query
//         pool.end();
//     } catch (err) {
//         console.error('Error connecting to the database:', err);
//         pool.end();
//     }
// }
//
// // Run the test
// testDbConnection();

//export {getUsers};
