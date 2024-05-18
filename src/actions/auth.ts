"use server";

import { signIn } from "@/auth";
import { insertUserDB } from "@/db/queries/user.query";
import { insertUserSchema } from "@/db/schemas";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const registerUser = async (_prevState: unknown, payload: FormData) => {
	const data = Object.fromEntries(payload.entries());

	const errors = {} as Record<string, string[]>;

	if (data.password !== data.confirmPassword) {
		errors.confirmPassword = ["Las contraseñas no coinciden"];
	}

	if (!data.email.toString().endsWith(".buap.mx")) {
		errors.email = ["Correo invalido, por favor use el correo institucional"];
	}

	const user = insertUserSchema.safeParse(data);
	console.log(user);
	if (!user.success) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(user.error.flatten().fieldErrors).forEach(([key, value]) => {
			errors[key] = value;
		});
		return errors;
	}

	// Save user to database
	const _id = crypto.randomUUID();
	await insertUserDB({
		...user.data,
		_id,
	});
	redirect("/login");
};

export const login = async (_prevState: unknown, payload: FormData) => {
	const { email, password } = Object.fromEntries(payload.entries());
	if (!email.toString().endsWith(".buap.mx")) {
		return {
			email: ["Correo invalido, por favor use el correo institucional"],
		};
	}
	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: "/",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						email: ["Correo o contraseña incorrectos."],
					};
				default:
					return {
						email: ["Ocurrió un error inesperado."],
					};
			}
		}
		throw error;
	}
};
