const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.DB_USER || 'myuser',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mydb',
    password: process.env.DB_PASS || 'mypassword',
    port: process.env.DB_PORT || 5432,
});

(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS reversed_ips (
                id SERIAL PRIMARY KEY,
                reversed_ip VARCHAR(64) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
    } finally {
        client.release();
    }
})();

function reverseIp(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) {
        return ip;
    }
    return parts.reverse().join('.');
}

app.get('/', async (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    const reversed = reverseIp(ip);

    const client = await pool.connect();
    try {
        await client.query('INSERT INTO reversed_ips (reversed_ip) VALUES ($1)', [reversed]);
    } finally {
        client.release();
    }

    res.send(Your reversed IP is: ${reversed}\n);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(App listening on port ${port});
});