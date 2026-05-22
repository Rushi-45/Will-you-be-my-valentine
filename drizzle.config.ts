import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// drizzle-kit reads .env by default; we use Next.js convention (.env.local)
config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
