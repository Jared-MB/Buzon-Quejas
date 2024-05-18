import { auth } from "@/auth";
import FormLayout from "@/components/form-layout";

import { getUserByEmail } from "@/db/queries/user.query";
import { redirect } from "next/navigation";
import React from "react";
import ComplaintForm from "./components/complaint-form";

export default async function UploadComplaintPage() {
	const session = await auth();

	if (!session || !session.user) {
		return redirect("/login");
	}

	const user = await getUserByEmail(session.user.email ?? "");

	if (!user) {
		return redirect("/login");
	}

	return (
		<FormLayout>
			<ComplaintForm user={user} />
		</FormLayout>
	);
}
