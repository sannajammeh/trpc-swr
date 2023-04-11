import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/better-sqlite3";

import Database from "better-sqlite3";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	name: text("name"),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now'))` as any,
	),
});

export const db = drizzle(new Database("sqlite.db"));
