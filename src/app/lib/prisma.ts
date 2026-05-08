import { PrismaClient } from '@prisma/client' 
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Forzamos que sea un string para evitar el error de "undefined"
const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  // Pasamos el adaptador tal como lo requiere tu configuración de Neon
  return new PrismaClient({ adapter })
}

// Definimos el tipo correctamente para que TypeScript no se queje
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma