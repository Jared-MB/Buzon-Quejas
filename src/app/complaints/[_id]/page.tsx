import { getComplaintByID } from "@/actions/complaint";
import { getRepliesByComplaintID } from "@/actions/reply";
import { auth } from "@/auth";
import Complaint from "@/components/complaint";
import Reply from "@/components/reply";
import { getUserByEmail } from "@/db/queries/user.query";

export default async function ComplaintPage({
	params,
}: {
	params: {
		_id: string;
	};
}) {
	const session = await auth();

	let userId = "";

	if (session?.user) {
		const user = await getUserByEmail(session.user.email ?? "");
		if (user) {
			userId = user._id;
		}
	}

	const complaint = await getComplaintByID(params._id);
	const replies = await getRepliesByComplaintID(params._id);

	if (!complaint) {
		return <div>Complaint not found</div>;
	}

	return (
		<main className="py-8 grid grid-cols-[1px_1fr] gap-x-4">
			<div className="border border-zinc-300 h-full w-full rounded-md" />
			<div className="flex flex-col gap-y-8">
				<Complaint
					complaint={complaint}
					showMore={false}
					hasSession={!!session}
				/>
				{replies.map((reply) => (
					<Reply
						complaintId={complaint._id}
						key={reply._id}
						reply={reply}
						complaintName={complaint.title}
						username={(reply as any).user}
						isSolved={complaint.status === "RESOLVED"}
					/>
				))}
			</div>
		</main>
	);
}
