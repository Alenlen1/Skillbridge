import "dotenv/config";
import { defineConfig } from "@prisma/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Runtime connection (uses port 6543 pooler)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    adapter,
    url: process.env.DIRECT_URL,
  },
});
