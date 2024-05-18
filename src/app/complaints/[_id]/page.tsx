import { getComplaintByID } from "@/actions/complaint";
import Complaint from "@/components/complaint";

export default async function ComplaintPage({
	params,
}: {
	params: {
		_id: string;
	};
}) {
	const complaint = await getComplaintByID(params._id);

	if (!complaint) {
		return <div>Complaint not found</div>;
	}

	return (
		<main className="py-8">
			<Complaint complaint={complaint} showMore={false} />
		</main>
	);
}
