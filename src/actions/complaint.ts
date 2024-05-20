"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { insertComplaintDB } from "@/db/queries/complaint.query";
import {
	type Complaint,
	complaints,
	insertComplaintSchema,
	users,
} from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ComplaintFilter = "all" | "RESOLVED" | "IN_PROGRESS" | "PENDING";

export const getComplaintsByUser = async (
	userId: string,
	filter: ComplaintFilter = "all",
) => {
	const user = (
		await db
			.select({ username: users.username })
			.from(users)
			.where(eq(users._id, userId))
	)[0];

	if (!user) {
		return [];
	}

	if (filter === "all") {
		const queryComplaints = await db
			.select()
			.from(complaints)
			.where(eq(complaints.userId, userId));
		return queryComplaints.map((complaint) => ({
			...complaint,
			user: !complaint.isAnonymous && user.username,
		}));
	}
	const queryComplaints = await db
		.select()
		.from(complaints)
		.where(and(eq(complaints.userId, userId), eq(complaints.status, filter)));
	return queryComplaints.map((complaint) => ({
		...complaint,
		user: !complaint.isAnonymous && user.username,
	}));
};

export const getComplaintByID = async (_id: string) => {
	const queryComplaints = await db
		.select()
		.from(complaints)
		.where(eq(complaints._id, _id));
	const complaint = queryComplaints[0] as Complaint & { user?: string };
	if (!complaint) {
		return null;
	}

	if (!complaint.isAnonymous) {
		const user = (
			await db
				.select({ username: users.username })
				.from(users)
				.where(eq(users._id, complaint.userId))
		)[0];
		complaint.user = user.username;
	}

	return complaint;
};

export const getLatestComplaints = async (filter: ComplaintFilter = "all") => {
	if (filter === "all") {
		const queryComplaints = await db
			.select()
			.from(complaints)
			.limit(5)
			.orderBy(desc(complaints.updatedAt));

		const queryComplaintsWithUser = queryComplaints.map(async (complaint) => {
			if (!complaint.isAnonymous) {
				const user = (
					await db
						.select({ username: users.username })
						.from(users)
						.where(eq(users._id, complaint.userId))
				)[0];
				return {
					...complaint,
					user: user.username,
				};
			}
			return complaint;
		});
		return await Promise.all(queryComplaintsWithUser);
	}
	const queryComplaints = await db
		.select()
		.from(complaints)
		.where(eq(complaints.status, filter))
		.limit(5)
		.orderBy(desc(complaints.updatedAt));
	const queryComplaintsWithUser = queryComplaints.map(async (complaint) => {
		if (!complaint.isAnonymous) {
			const user = (
				await db
					.select({ username: users.username })
					.from(users)
					.where(eq(users._id, complaint.userId))
			)[0];
			return {
				...complaint,
				user: user.username,
			};
		}
		return complaint;
	});
	return await Promise.all(queryComplaintsWithUser);
};

export const getComplaints = async (filter: ComplaintFilter = "all") => {
	if (filter === "all") {
		const queryComplaints = await db
			.select()
			.from(complaints)
			.limit(10)
			.orderBy(desc(complaints.createdAt));

		const queryComplaintsWithUser = queryComplaints.map(async (complaint) => {
			if (!complaint.isAnonymous) {
				const user = (
					await db
						.select({ username: users.username })
						.from(users)
						.where(eq(users._id, complaint.userId))
				)[0];
				return {
					...complaint,
					user: user.username,
				};
			}
			return complaint;
		});
		return await Promise.all(queryComplaintsWithUser);
	}
	const queryComplaints = await db
		.select()
		.from(complaints)
		.where(eq(complaints.status, filter))
		.limit(10)
		.orderBy(desc(complaints.createdAt));
	const queryComplaintsWithUser = queryComplaints.map(async (complaint) => {
		if (!complaint.isAnonymous) {
			const user = (
				await db
					.select({ username: users.username })
					.from(users)
					.where(eq(users._id, complaint.userId))
			)[0];
			return {
				...complaint,
				user: user.username,
			};
		}
		return complaint;
	});
	return await Promise.all(queryComplaintsWithUser);
};

export const insertComplaint = async (
	_prevState: unknown,
	payload: FormData,
) => {
	const data = Object.fromEntries(payload.entries());

	const complaint = insertComplaintSchema.safeParse({
		...data,
		isAnonymous: data.isAnonymous === "on",
		createdAt: new Date(),
		updatedAt: new Date(),
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
		at: complaint.data.at ? new Date(complaint.data.at) : null,
		createdAt: new Date(),
		updatedAt: new Date(),
	}).catch((error) => {
		console.error(error);
		return { error: ["Error al insertar la queja"] };
	});

	revalidatePath("/");
	redirect("/");
};

export const markComplaintAsResolved = async (
	_prevState: unknown,
	data: FormData,
) => {
	const _id = data.get("_id")?.toString();
	const username = data.get("username")?.toString();

	if (!_id) {
		return { error: ["Error updating complaint"] };
	}

	const complaint = await getComplaintByID(_id);

	if (!complaint) {
		return { error: ["Complaint not found"] };
	}

	if (complaint.status === "RESOLVED") {
		return { error: ["Complaint already resolved"] };
	}

	const updatedComplaint = await db
		.update(complaints)
		.set({ status: "RESOLVED", updatedAt: new Date() })
		.where(eq(complaints._id, _id));

	if (!updatedComplaint) {
		return { error: ["Error updating complaint"] };
	}

	revalidatePath(`/${username}/complaints/${_id}`);
};
