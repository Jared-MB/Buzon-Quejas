"use client";

import { markComplaintAsResolved } from "@/actions/complaint";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useDialogForm from "@/hooks/useDialogForm";
import { useParams } from "next/navigation";
import React from "react";

export default function SolveComplaint() {
	const params = useParams();

	const { action, modal } = useDialogForm(
		markComplaintAsResolved as any,
		{},
		{
			entityName: "queja",
		},
	);

	return (
		<Dialog open={modal.open} onOpenChange={modal.setOpen}>
			<DialogTrigger asChild>
				<Button variant="link">Marcar como resuelto</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Marcar como resuelto</DialogTitle>
				</DialogHeader>
				<form action={action}>
					<p>¿Estás seguro de que quieres marcar esta queja como resuelta?</p>
					<input type="hidden" name="_id" value={params._id} readOnly hidden />
					<input
						type="hidden"
						name="username"
						value={params.username}
						readOnly
						hidden
					/>
					<DialogFooter>
						<Button
							variant="link"
							type="button"
							onClick={() => modal.setOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit">Marcar como resuelto</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
