"use client";

import { insertComplaint } from "@/actions/complaint";
import { insertReply } from "@/actions/reply";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useDialogForm from "@/hooks/useDialogForm";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import { CheckboxWithText } from "./ui/checkbox";
import Divider from "./ui/divider";
import { InputContainer, InputError } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function ReplyForm({
	complaintId,
	complaintName,
}: {
	complaintId: string;
	complaintName: string;
}) {
	const { action, modal } = useDialogForm(insertReply, undefined, {
		entityName: "Respuesta",
		gender: "female",
	});

	return (
		<Dialog open={modal.open} onOpenChange={modal.setOpen}>
			<DialogTrigger asChild>
				<Button variant="link">Responder</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogDescription>Responder:</DialogDescription>{" "}
					<DialogTitle>{complaintName}</DialogTitle>
				</DialogHeader>
				<Divider />
				<form className="flex flex-col gap-y-4" action={action}>
					<input
						type="hidden"
						name="complaintId"
						value={complaintId}
						readOnly
						hidden
					/>
					<InputContainer>
						<Label htmlFor="description">Respuesta:</Label>
						<Textarea name="description" />
						{/* {errors?.description && (
							<InputError>{errors.description}</InputError>
						)} */}
					</InputContainer>
					<CheckboxWithText
						label="Hacer anónima"
						name="isAnonymous"
						defaultChecked
						description="Tu respuesta será mostrada sin tus datos"
					/>
					<DialogFooter>
						<Button
							onClick={() => modal.setOpen(false)}
							type="button"
							variant="outline"
						>
							Cancelar
						</Button>
						<SubmitButton />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Enviando respuesta..." : "Enviar respuesta"}
		</Button>
	);
};
