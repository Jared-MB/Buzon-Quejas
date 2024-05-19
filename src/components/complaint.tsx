"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import {
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import Divider from "./ui/divider";

import { ComplaintStatus } from "@/constants/status";
import type { Complaint as ComplaintType } from "@/db/schemas";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import ReplyForm from "./reply-form";
import { Button, buttonVariants } from "./ui/button";

export default function Complaint({
	complaint,
	showMore = true,
	toProfile = {},
	showReply = true,
	hasSession = false,
}: {
	complaint: ComplaintType & { username?: string };
	showMore?: boolean;
	toProfile?: { username?: string };
	showReply?: boolean;
	hasSession?: boolean;
}) {
	const badgeVariant = useMemo(() => {
		let badgeVariant = "default" as "default" | "outline" | "secondary";
		if (complaint.status === "PENDING") {
			badgeVariant = "outline";
		} else if (complaint.status === "IN_PROGRESS") {
			badgeVariant = "secondary";
		}
		return badgeVariant;
	}, [complaint.status]);

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const router = useRouter();

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>{complaint.title}</CardTitle>
					<CardDescription>
						{complaint.isAnonymous ? "Anónima" : `De: ${complaint.username}`}
					</CardDescription>
					<Badge className="top-4 right-4 absolute" variant={badgeVariant}>
						{ComplaintStatus[complaint.status]}
					</Badge>
				</CardHeader>
				<Divider />
				<CardBody>
					<p>{complaint.description}</p>
				</CardBody>
				<CardFooter className="justify-between">
					<CardDescription>
						Última actualización: {complaint.updatedAt.toLocaleTimeString()} del{" "}
						{complaint.updatedAt.toDateString()}
					</CardDescription>
					<div>
						{complaint.status !== "RESOLVED" && showReply && (
							<Button
								variant="link"
								onClick={() =>
									hasSession ? setIsOpen(true) : router.push("/login")
								}
								// className={buttonVariants({
								// 	variant: "link",
								// })}
								// href={`${
								// 	toProfile.username ? `/${toProfile.username}/` : "/"
								// }complaints/${complaint._id}?reply=true`}
							>
								Responder
							</Button>
						)}
						{showMore && (
							<Link
								className={buttonVariants({
									variant: "link",
									className: "flex flex-row items-center gap-x-2",
								})}
								href={`${
									toProfile.username ? `/${toProfile.username}/` : "/"
								}complaints/${complaint._id}`}
							>
								Ver más <ExternalLink className="w-4 h-4" />
							</Link>
						)}
					</div>
				</CardFooter>
			</Card>
			<ReplyForm
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				complaintName={complaint.title}
				complaintId={complaint._id}
			/>
		</>
	);
}
