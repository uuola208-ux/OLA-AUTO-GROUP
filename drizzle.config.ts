/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  // in production we expect a cloud sqlite URL (e.g. Turso/libsql)
  // the environment variables are configured on Render (or any host)
  dbCredentials: {
    // use the cloud connection URL when provided, otherwise fall back
    // to a local sqlite file for development/testing
    url: process.env.TURSO_CONNECTION_URL || "file:sqlite.db",
  },
});
