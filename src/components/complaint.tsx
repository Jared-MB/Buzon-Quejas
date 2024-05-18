import Link from "next/link";
import React from "react";
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
import { buttonVariants } from "./ui/button";

export default function Complaint({
	complaint,
	showMore = true,
}: { complaint: ComplaintType; showMore?: boolean }) {
	let badgeVariant = "default" as "default" | "outline" | "secondary";
	if (complaint.status === "PENDING") {
		badgeVariant = "outline";
	} else if (complaint.status === "IN_PROGRESS") {
		badgeVariant = "secondary";
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{complaint.title}</CardTitle>
				<CardDescription>
					Última actualización: {complaint.updatedAt.toDateString()}
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
					Creado: {complaint.createdAt.toDateString()}
				</CardDescription>
				{showMore && (
					<Link
						className={buttonVariants({
							variant: "link",
						})}
						href={`/complaints/${complaint._id}`}
					>
						{" "}
						Ver más{" "}
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
