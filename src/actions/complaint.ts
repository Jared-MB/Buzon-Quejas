"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { insertComplaintDB } from "@/db/queries/complaint.query";
import { complaints, insertComplaintSchema } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ComplaintFilter = "all" | "RESOLVED" | "IN_PROGRESS" | "PENDING";

export const getComplaintsByUser = async (
	userId: string,
	filter: ComplaintFilter = "all",
) => {
	if (filter === "all") {
		return await db
			.select()
			.from(complaints)
			.where(eq(complaints.userId, userId));
	}
	return await db
		.select()
		.from(complaints)
		.where(and(eq(complaints.userId, userId), eq(complaints.status, filter)));
};

export const getComplaintByID = async (_id: string) => {
	const queryComplaints = await db
		.select()
		.from(complaints)
		.where(eq(complaints._id, _id));
	const complaint = queryComplaints[0];
	if (!complaint) {
		return null;
	}
	return complaint;
};

export const getLatestComplaints = async (filter: ComplaintFilter = "all") => {
	if (filter === "all") {
		return await db
			.select()
			.from(complaints)
			.limit(5)
			.orderBy(desc(complaints.createdAt));
	}
	return await db
		.select()
		.from(complaints)
		.where(eq(complaints.status, filter))
		.limit(5)
		.orderBy(desc(complaints.createdAt));
};

export const getComplaints = async (filter: ComplaintFilter = "all") => {
	if (filter === "all") {
		return await db
			.select()
			.from(complaints)
			.limit(10)
			.orderBy(desc(complaints.createdAt));
	}
	return await db
		.select()
		.from(complaints)
		.limit(10)
		.where(eq(complaints.status, filter))
		.orderBy(desc(complaints.createdAt));
};

export const insertComplaint = async (
	_prevState: unknown,
	payload: FormData,
) => {
	const data = Object.fromEntries(payload.entries());

	const complaint = insertComplaintSchema.safeParse({
		...data,
		isAnonymous: data.isAnonymous === "on",
	});

	if (!complaint.success) {
		const errors = {} as Record<string, string[]>;
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(complaint.error.flatten().fieldErrors).forEach(
			([key, value]) => {
				errors[key] = value;
			},
		);
		return errors;
	}

	const _id = crypto.randomUUID();

	insertComplaintDB({
		...complaint.data,
		_id,
		at: new Date(complaint.data.at ?? ""),
		createdAt: new Date(),
		updatedAt: new Date(),
	}).catch((error) => {
		console.error(error);
		return { error: ["Error al insertar la queja"] };
	});

	revalidatePath("/");
	redirect("/");
};
