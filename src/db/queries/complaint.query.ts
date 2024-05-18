import { db } from "..";
import { type InsertComplaint, complaints } from "../schemas";

export const insertComplaintDB = async (complaint: InsertComplaint) =>
	await db.insert(complaints).values(complaint);
