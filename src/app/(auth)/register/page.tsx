"use client";

import { registerUser } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardBody, CardFooter } from "@/components/ui/card";
import { Input, InputContainer, InputError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function RegisterPage() {
	const [errors, dispatch] = useFormState(registerUser, undefined);

	return (
		<form action={dispatch}>
			<h2 className="text-3xl p-6 pb-4 font-medium flex flex-row gap-x-2 items-center">
				<Shield className="text-purple-500 w-12 h-12" />
				¡Bienvenido!
			</h2>
			<CardBody>
				<InputContainer>
					<Label>Nombre</Label>
					<Input name="name" placeholder="Jared" />
					{errors?.name && <InputError>{errors.name[0]}</InputError>}
				</InputContainer>
				<InputContainer>
					<Label>Apellido</Label>
					<Input name="lastName" placeholder="Muñoz" />
					{errors?.lastName && <InputError>{errors.lastName}</InputError>}
				</InputContainer>
				<InputContainer>
					<Label>Usuario</Label>
					<Input name="username" placeholder="usuario" />
					{errors?.username && <InputError>{errors.username[0]}</InputError>}
				</InputContainer>
				<div className="flex flex-row items-start gap-x-4">
					<InputContainer>
						<Label>Matrícula</Label>
						<Input name="matricula" type="number" placeholder="202178172" />
						{errors?.matricula && (
							<InputError>{errors.matricula[0]}</InputError>
						)}
					</InputContainer>
					<InputContainer>
						<Label>Teléfono</Label>
						<Input name="phone" placeholder="222 198 37 90" />
						{errors?.phone && <InputError>{errors.phone[0]}</InputError>}
					</InputContainer>
				</div>
				<InputContainer>
					<Label>Carrera</Label>
					<Input
						name="career"
						placeholder="Ingeniería en Tecnologías de la Información"
					/>
					{errors?.career && <InputError>{errors.career[0]}</InputError>}
				</InputContainer>
				<InputContainer>
					<Label>Correo</Label>
					<Input name="email" placeholder="correo@alumno.buap.mx" />
					{errors?.email && <InputError>{errors.email[0]}</InputError>}
				</InputContainer>
				<div className="flex flex-col md:flex-row items-start gap-x-4 gap-y-2">
					<InputContainer>
						<Label>Contraseña</Label>
						<Input
							name="password"
							type="password"
							placeholder="* * * * * * * *"
						/>
						{errors?.password && <InputError>{errors.password[0]}</InputError>}
					</InputContainer>
					<InputContainer>
						<Label>Confirmar contraseña</Label>
						<Input
							name="confirmPassword"
							type="password"
							placeholder="* * * * * * * *"
						/>
						{errors?.confirmPassword && (
							<InputError>{errors.confirmPassword[0]}</InputError>
						)}
					</InputContainer>
				</div>
			</CardBody>
			<CardFooter className="justify-end gap-x-4">
				<Link
					className={buttonVariants({
						variant: "outline",
					})}
					href="/"
				>
					Cancelar
				</Link>
				<SubmitButton />
			</CardFooter>
		</form>
	);
}

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Registrando..." : "Registrarse"}
		</Button>
	);
};
