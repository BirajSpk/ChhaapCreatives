const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'chhaap_creatives'}\`;`);
    console.log(`Database ${process.env.DB_NAME || 'chhaap_creatives'} created or already exists.`);
    await connection.end();
}

createDb().catch(err => {
    console.error('Failed to create database:', err);
    process.exit(1);
});
