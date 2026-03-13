/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL || "file:./sqlite.db",
  },
});
