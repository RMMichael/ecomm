const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydb',
    password: 'password',
    port: 54321,
})


const getUsers = (request, response) => {
    pool.query('SELECT * FROM t', (error: any, results: { rows: any }) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

export {getUsers};
