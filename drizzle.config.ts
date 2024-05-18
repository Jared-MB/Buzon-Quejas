import { defineConfig } from "drizzle-kit";

import * as dotenv from "dotenv";
dotenv.config({
	path: ".env.development.local",
});

export default defineConfig({
	schema: ["src/db/schemas.ts"],
	driver: "pg",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		connectionString: process.env.POSTGRES_URL!,
	},
});
