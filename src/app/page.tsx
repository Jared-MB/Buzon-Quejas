import {
	type ComplaintFilter as ComplaintFilterType,
	getLatestComplaints,
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
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home({
	searchParams,
}: {
	searchParams: {
		filter: ComplaintFilterType;
	};
}) {
	const params = new URLSearchParams(searchParams);

	const session = await auth();

	const complaints = await getLatestComplaints(
		(params.get("filter") as ComplaintFilterType) ?? "all",
	);

	return (
		<main className="max-w-6xl mx-auto py-8">
			<header className="flex flex-row justify-between items-center mb-4">
				<h2 className="text-2xl font-medium">Quejas recientes</h2>
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
							<Link href="/complaints" className="w-full h-full">
								Ver todas
							</Link>
						</DropdownMenuItem>
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
					<Link
						href="/complaints"
						className={buttonVariants({
							variant: "link",
						})}
					>
						{" "}
						Ver todas{" "}
					</Link>
					<ComplaintFilter />
					{session && (
						<Link
							href="/complaints/upload"
							className={buttonVariants({
								variant: "default",
							})}
						>
							Hacer una queja
						</Link>
					)}
				</div>
			</header>
			<div className="flex flex-col gap-y-4">
				{complaints.map((complaint) => (
					<Complaint complaint={complaint} key={complaint._id} />
				))}
			</div>
		</main>
	);
}
