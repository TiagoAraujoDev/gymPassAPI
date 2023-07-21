import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID as uuid } from "node:crypto";
import { Environment } from "vitest";

const prisma = new PrismaClient();

function genareteDatabaseUrl(schema: string): string {
  if (!process.env.DATABASE_URL) {
    throw new Error("Provide a DATABASE_URL in the environment variables");
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  async setup() {
    const schema = uuid();

    const databaseUrl = genareteDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma migrate deploy");
    return {
      async teardown() {
        await prisma.$queryRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        prisma.$disconnect();
      },
    };
  },
};
