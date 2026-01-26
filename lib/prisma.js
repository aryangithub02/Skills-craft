import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const createPrismaClient = () => {
    // Determine if we're in a build context or runtime where connection might not be needed immediately
    // or if the env var is just missing.
    // If connectionString is missing, use default PrismaClient behavior or throw a more clear error later.
    // However, simply calling `new Pool` with undefined will crash.
    if (!connectionString) {
        // If no connection string, return a basic client. 
        // This will likely fail if a query is attempted, but allows imports to succeed.
        return new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        })
    }

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
