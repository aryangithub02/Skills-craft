const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

// Load envs similar to Next.js
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

/**
 * Tests the database connection using DATABASE_URL and a Prisma PostgreSQL adapter.
 *
 * Attempts to count user records to verify connectivity, logs the success or error outcome,
 * and always disconnects the Prisma client and closes the PostgreSQL pool.
 */
async function main() {
    const url = process.env.DATABASE_URL;
    console.log('Testing DB connection with Adapter...');
    console.log('URL defined:', !!url);
    if (url) console.log('URL starts with:', url.substring(0, 15) + '...');

    if (!url) {
        console.error('DATABASE_URL is missing!');
        return;
    }

    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const count = await prisma.user.count();
        console.log(`✅ Connection Successful! User count: ${count}`);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();