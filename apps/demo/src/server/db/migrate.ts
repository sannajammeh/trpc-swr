import { migrate } from "drizzle-orm//better-sqlite3/migrator";
import { db } from "./schema";
import path from "node:path";

export const runMigrations = async () => {
	migrate(db, {
		migrationsFolder: path.resolve(__dirname, "migrations"),
	});

	console.log("Database is migrated");
};
