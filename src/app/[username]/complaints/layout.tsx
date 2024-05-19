import {
	type ComplaintFilter as ComplaintFilterType,
	getComplaintsByUser,
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
import { redirect } from "next/navigation";

export default async function UsernameComplaintsLayout({
	params,
	// searchParams,
	children,
}: {
	params: {
		username: string;
	};
	// searchParams: string;
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session || !session.user) {
		redirect("/login");
	}

	const user = await getUserByEmail(session.user.email ?? "");

	if (!user) {
		redirect("/");
	}

	if (params.username !== user.username) {
		redirect("/");
	}

	// const searchParamsFilter = new URLSearchParams(searchParams);

	const complaints = await getComplaintsByUser(
		user._id,
		// (searchParamsFilter.get("filter") as ComplaintFilterType) ??
		"all",
	);

	return (
		<main className="max-w-6xl mx-auto py-8">
			<header className="flex flex-row justify-between items-center mb-4">
				<h2 className="text-2xl font-medium">Mis quejas</h2>
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
						{session && (
							<DropdownMenuItem>
								<Link href="/complaints/upload" className="w-full h-full">
									Hacer una queja
								</Link>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="hidden md:flex flex-row gap-x-4 items-end">
					<ComplaintFilter />
					<Link
						href="/complaints/upload"
						className={buttonVariants({
							variant: "default",
						})}
					>
						Hacer una queja
					</Link>
				</div>
			</header>
			<section className="flex flex-row w-full gap-x-8">
				<div className="flex flex-col gap-y-4 w-full">
					{complaints.map((complaint) => (
						<Complaint
							complaint={complaint}
							key={complaint._id}
							toProfile={{ username: user.username }}
							showReply={false}
						/>
					))}
				</div>
				{children}
			</section>
		</main>
	);
}
