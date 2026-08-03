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
        return new PrismaClient({
            log: ['error', 'warn'],
        })
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    })
}


export const db = globalThis.prisma || createPrismaClient();

// Connection handled lazily by Prisma Client

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
