import NextAuth from "next-auth";

import { authUser } from "@/db/queries/user.query";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				const { password, email } = credentials;

				if (typeof password !== "string" || typeof email !== "string") {
					return null;
				}

				let user = null;
				// const pwHash = saltAndHashPassword(credentials.password)

				// logic to verify if user exists
				try {
					user = await authUser(email, password);
					if (!user) {
						return null;
					}
					return user;
				} catch (error) {
					return null;
				}
			},
		}),
	],
});
