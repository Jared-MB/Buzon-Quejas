import {
	type ComplaintFilter as ComplaintFilterType,
	getComplaints,
} from "@/actions/complaint";
import { auth } from "@/auth";
import Complaint from "@/components/complaint";
import ComplaintFilter from "@/components/complaint-filter";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserByEmail } from "@/db/queries/user.query";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

export default async function ComplaintsPage({
	searchParams,
}: {
	searchParams: {
		filter: ComplaintFilterType;
	};
}) {
	const params = new URLSearchParams(searchParams);
	const session = await auth();

	let userId = "";

	if (session?.user) {
		const user = await getUserByEmail(session.user.email ?? "");
		if (user) {
			userId = user._id;
		}
	}

	const complaints = await getComplaints(
		(params.get("filter") as ComplaintFilterType) ?? "all",
	);

	return (
		<main className="max-w-6xl mx-auto py-8">
			<header className="flex flex-row justify-between items-center mb-4">
				<h2 className="text-2xl font-medium">Quejas</h2>
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="inline-block md:hidden">
						<Button variant="outline" size="icon">
							<MoreVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<ComplaintFilter />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={session ? "/complaints/upload" : "/login"}
								className="w-full h-full"
							>
								Hacer una queja
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="hidden md:flex flex-row gap-x-4 items-end">
					<ComplaintFilter />
					<Link
						href={session ? "/complaints/upload" : "/login"}
						className={buttonVariants({
							variant: "default",
						})}
					>
						Hacer una queja
					</Link>
				</div>
			</header>
			<div className="flex flex-col gap-y-4">
				{complaints.map((complaint) => (
					<Complaint
						complaint={complaint}
						key={complaint._id}
						hasSession={!!session}
						showReply={complaint.status === "RESOLVED"}
					/>
				))}
			</div>
		</main>
	);
}
