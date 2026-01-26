const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
pool.connect((err, client, release) => {
    if (err) {
        console.error('Connection error', err.stack);
        process.exit(1);
    }
    console.log('Successfully connected to Neon DB');
    client.end();
});
