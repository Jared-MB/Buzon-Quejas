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
} from "@/components/ui/dialog";
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
	isOpen,
	setIsOpen,
	complaintId,
	complaintName,
}: {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	complaintId: string;
	complaintName: string;
}) {
	const [errors, dispatch] = useFormState(insertReply, undefined);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogDescription>Responder:</DialogDescription>{" "}
					<DialogTitle>{complaintName}</DialogTitle>
				</DialogHeader>
				<Divider />
				<form className="flex flex-col gap-y-4" action={dispatch}>
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
						{errors?.description && (
							<InputError>{errors.description}</InputError>
						)}
					</InputContainer>
					<CheckboxWithText
						label="Hacer anónima"
						name="isAnonymous"
						defaultChecked
						description="Tu respuesta será mostrada sin tus datos"
					/>
					<DialogFooter>
						<Button
							onClick={() => setIsOpen(false)}
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
