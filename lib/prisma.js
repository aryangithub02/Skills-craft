import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const createPrismaClient = () => {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
    })
}


export const db = globalThis.prisma || createPrismaClient();

// Connection handled lazily by Prisma Client

// Debug: Log the DB URL (safely)
console.log("Prisma Client Initialized with Adapter");

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
