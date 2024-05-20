import { getComplaintByID } from "@/actions/complaint";
import { getRepliesByComplaintID } from "@/actions/reply";
import Complaint from "@/components/complaint";
import Reply from "@/components/reply";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SolveComplaint from "./components/solve-complaint";

export default async function ComplaintPage({
	params,
}: {
	params: {
		_id: string;
	};
}) {
	const complaint = await getComplaintByID(params._id);
	const replies = await getRepliesByComplaintID(params._id);

	if (!complaint) {
		return <div>Complaint not found</div>;
	}

	return (
		<aside className="w-full grid grid-cols-[1fr_1px] gap-x-4">
			<div className="flex flex-col gap-y-8">
				<Complaint complaint={complaint} showMore={false} />
				{replies.map((reply) => (
					<Reply
						complaintId={complaint._id}
						key={reply._id}
						reply={reply}
						complaintName={complaint.title}
						username={complaint.user}
					/>
				))}
				<footer
					className={cn(
						"flex w-full justify-end",
						complaint.status === "RESOLVED" && "hidden",
					)}
				>
					<SolveComplaint />
				</footer>
			</div>
			<div className="border border-zinc-300 h-full w-full rounded-md" />
		</aside>
	);
}
