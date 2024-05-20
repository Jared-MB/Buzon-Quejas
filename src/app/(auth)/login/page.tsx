"use client";

import { login } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardBody, CardFooter } from "@/components/ui/card";
import { Input, InputContainer, InputError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function LoginPage() {
	const [errors, dispatch] = useFormState(login, undefined);

	return (
		<form action={dispatch}>
			<h2 className="text-3xl p-6 pb-4 font-medium flex flex-row gap-x-2 items-center">
				<Shield className="text-purple-500 w-12 h-12" />
				¡Bienvenido de vuelta!
			</h2>
			<CardBody>
				<InputContainer>
					<Label>Correo electrónico</Label>
					<Input
						type="email"
						name="email"
						placeholder="correo@alumno.buap.mx"
					/>
					{errors?.email && <InputError>{errors.email[0]}</InputError>}
				</InputContainer>
				<InputContainer>
					<Label>Contraseña</Label>
					<Input
						type="password"
						name="password"
						placeholder="* * * * * * * *"
					/>
				</InputContainer>
			</CardBody>
			<CardFooter className="justify-end">
				<Link
					href="/register"
					className={buttonVariants({
						variant: "link",
					})}
				>
					Registrarse
				</Link>
				<SubmitButton />
			</CardFooter>
			{errors && !errors.email && toast(Object.entries(errors)[0][0])}
		</form>
	);
}

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Iniciando sesión..." : "Iniciar sesión"}
		</Button>
	);
};
