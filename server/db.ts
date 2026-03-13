import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@shared/schema";

// support both local sqlite and a Turso/cloud SQLite connection
const client = createClient({
	url: process.env.TURSO_CONNECTION_URL || "file:sqlite.db",
	// authToken is only required for cloud providers like Turso;
	// undefined is fine for a local file
	authToken: process.env.TURSO_AUTH_TOKEN,
});
export const db = drizzle(client, { schema });