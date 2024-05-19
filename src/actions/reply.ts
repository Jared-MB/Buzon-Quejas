"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import {
	Reply,
	complaints,
	insertReplySchema,
	replies,
	users,
} from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getRepliesByComplaintID = async (complaintId: string) => {
	const queryReplies = await db
		.select()
		.from(replies)
		.where(eq(replies.complaintId, complaintId));
	const repliesWithUser = queryReplies.map(async (reply) => {
		if (!reply.isAnonymous) {
			const user = (
				await db
					.select({ username: users.username })
					.from(users)
					.where(eq(users._id, reply.userId))
			)[0];
			return {
				...reply,
				user: user.username,
			};
		}
		return reply;
	});
	return await Promise.all(repliesWithUser);
};

export const insertReply = async (_prevState: unknown, payload: FormData) => {
	const session = await auth();

	if (!session || !session.user) {
		redirect("/login");
	}

	const user = (
		await db
			.select({ _id: users._id })
			.from(users)
			.where(eq(users.email, session.user.email ?? ""))
	)[0];

	if (!user) {
		redirect("/login");
	}

	const data = Object.fromEntries(payload.entries());
	const _id = crypto.randomUUID();

	const parsedData = insertReplySchema.safeParse({
		...data,
		_id,
		userId: user._id,
		createdAt: new Date(),
		isAnonymous: data.isAnonymous === "on",
	});

	if (!parsedData.success) {
		const errors = {} as Record<string, string[]>;
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(parsedData.error.flatten().fieldErrors).forEach(
			([key, value]) => {
				errors[key] = value;
			},
		);
		return errors;
	}

	const complaint = (
		await db
			.select({ createdAt: complaints.createdAt })
			.from(complaints)
			.where(eq(complaints._id, parsedData.data.complaintId))
	)[0];

	await db.insert(replies).values(parsedData.data);
	await db
		.update(complaints)
		.set({
			updatedAt: new Date(),
			status: "IN_PROGRESS",
			createdAt: new Date(complaint.createdAt),
		})
		.where(eq(complaints._id, parsedData.data.complaintId));

	revalidatePath(`/complaints/${data.complaintId}`);
	redirect(`/complaints/${data.complaintId}`);
};
