import type { Reply as ReplyType } from "@/db/schemas";
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
	username,
}: { reply: ReplyType; complaintName: string; username?: string }) {
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
			<CardFooter>
				<CardDescription>
					Creado: {reply.createdAt.toLocaleTimeString()} del{" "}
					{reply.createdAt.toDateString()}
				</CardDescription>
			</CardFooter>
		</Card>
	);
}
