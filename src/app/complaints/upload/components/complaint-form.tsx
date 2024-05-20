"use client";

import { insertComplaint } from "@/actions/complaint";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckboxWithText } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import Divider from "@/components/ui/divider";
import {
	Input,
	InputContainer,
	InputDescription,
	InputError,
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/db/schemas";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function ComplaintForm({ user }: { user: User }) {
	const [errors, dispatch] = useFormState(insertComplaint, undefined);

	return (
		<form action={dispatch}>
			<CardHeader>
				<h2 className="text-3xl font-medium flex flex-row gap-x-2 items-center">
					Hacer una queja
				</h2>
			</CardHeader>
			<Divider />
			<CardBody>
				<input type="hidden" name="userId" readOnly hidden value={user._id} />
				<div className="flex flex-row gap-x-4 items-center mb-4">
					<CircleUserRound className="h-10 w-10" />
					<div>
						<p className="text-lg font-medium">
							{`${user.name} ${user.lastName}`}
						</p>
						<p className="text-base text-muted-foreground">{user.email}</p>
					</div>
				</div>
				<CheckboxWithText
					label="Hacer anónima"
					name="isAnonymous"
					defaultChecked
					description="Tu queja será mostrada sin tus datos"
				/>
			</CardBody>
			<Divider />
			<CardBody>
				<InputContainer>
					<Label>Queja</Label>
					<Input name="title" placeholder="¿Qué pasó?" />
					{errors?.title && <InputError>{errors.title}</InputError>}
				</InputContainer>
				<InputContainer>
					<Label>Descripción</Label>
					<Textarea
						name="description"
						placeholder="Cuéntanos más sobre lo que pasó..."
						rows={4}
					/>
					{errors?.description && <InputError>{errors.description}</InputError>}
				</InputContainer>
				<InputContainer>
					<Label>
						Fecha <small>(opcional)</small>
					</Label>
					<DatePicker />
					<InputDescription>Día en que ocurrió el incidente</InputDescription>
				</InputContainer>
				<InputContainer>
					<Label>
						Ubicación <small>(opcional)</small>
					</Label>
					<Input name="location" placeholder="Facultad de ..." />
					<InputDescription>Lugar donde ocurrió el incidente</InputDescription>
				</InputContainer>
			</CardBody>
			<CardFooter className="justify-end gap-x-4">
				<Link
					href="/"
					className={buttonVariants({
						variant: "outline",
					})}
				>
					{" "}
					Cancelar{" "}
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
			{pending ? "Enviando queja..." : "Enviar queja"}
		</Button>
	);
};
