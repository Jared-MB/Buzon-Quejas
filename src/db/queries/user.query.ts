import { type InsertUser, users } from "@/db/schemas";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "..";

export const authUser = async (email: string, password: string) => {
	const user = (await db.select().from(users).where(eq(users.email, email)))[0];
	if (!user) {
		return null;
	}
	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return null;
	}

	const { password: _, ...userWithoutPassword } = user;

	return userWithoutPassword;
};

export const getUserByEmail = async (email: string) => {
	const user = (await db.select().from(users).where(eq(users.email, email)))[0];
	if (!user) {
		return null;
	}
	const { password: _, ...userWithoutPassword } = user;

	return userWithoutPassword;
};

export const insertUserDB = async (user: InsertUser) => {
	const hashedPassword = await bcrypt.hash(user.password, 10);
	const userWithHashedPassword = {
		...user,
		password: hashedPassword,
	};

	return await db.insert(users).values(userWithHashedPassword);
};
