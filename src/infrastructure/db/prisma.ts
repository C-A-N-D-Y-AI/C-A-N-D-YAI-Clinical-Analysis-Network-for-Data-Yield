import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.APP_DATABASE_URL ??
  process.env.SESSION_DATABASE_URL ??
  process.env.DATABASE_URL;

function shouldUseSsl(url: string) {
  const databaseUrl = new URL(url);
  return databaseUrl.hostname.includes("supabase.com");
}

function logDatabaseTarget(url: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const databaseUrl = new URL(url);
  console.info(
    `[DB] user=${databaseUrl.username} host=${databaseUrl.host} database=${databaseUrl.pathname.replace("/", "")}`,
  );
}

const prismaClientSingleton = () => {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  logDatabaseTarget(connectionString);

  const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
};

// Definimos el tipo correctamente para que TypeScript no se queje
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma:
    | {
        client: PrismaClientSingleton;
        connectionString: string;
      }
    | undefined;
};

function getPrismaClient() {
  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.prisma?.connectionString !== connectionString
  ) {
    void globalForPrisma.prisma?.client.$disconnect();
    globalForPrisma.prisma = undefined;
  }

  const client = globalForPrisma.prisma?.client ?? prismaClientSingleton();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = { client, connectionString: connectionString ?? "" };
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClientSingleton, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
