import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import {
	complaints,
	complaintsRelations,
	users,
	usersRelations,
} from "./schemas";

export const db = drizzle(sql, {
	schema: {
		users,
		complaints,
		complaintsRelations,
		usersRelations,
	},
});
