"use client";

import type { Reply as ReplyType } from "@/db/schemas";
import ReplyForm from "./reply-form";
import {
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardSubtitle,
} from "./ui/card";
import Divider from "./ui/divider";

export default function Reply({
	reply,
	complaintName,
	complaintId,
	username,
	isSolved = false,
}: {
	reply: ReplyType;
	complaintName: string;
	username?: string;
	complaintId: string;
	isSolved?: boolean;
}) {
	return (
		<Card>
			<CardHeader>
				<CardDescription>Respuesta a:</CardDescription>
				<CardSubtitle>{complaintName}</CardSubtitle>
				<small>{username || "Anónimo"}</small>
			</CardHeader>
			<Divider />
			<CardBody>
				<p className="text-pretty">{reply.description}</p>
			</CardBody>
			<CardFooter className="justify-between">
				<CardDescription>
					Creado: {reply.createdAt.toLocaleString()}
				</CardDescription>
				{!isSolved && (
					<ReplyForm complaintId={complaintId} complaintName={complaintName} />
				)}
			</CardFooter>
		</Card>
	);
}
