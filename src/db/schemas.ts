import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);

export const users = pgTable("users", {
	_id: uuid("_id").primaryKey(),
	name: varchar("name", {
		length: 256,
	}).notNull(),
	lastName: varchar("lastName", {
		length: 256,
	}).notNull(),
	phone: varchar("phone", {
		length: 10,
	}).notNull(),
	username: varchar("username", {
		length: 32,
	}).notNull(),
	password: varchar("password").notNull(),
	role: roleEnum("role").notNull().default("USER"),
	email: varchar("email", {
		length: 256,
	}).notNull(),
	matricula: varchar("matricula", {
		length: 9,
	}).notNull(),
	career: varchar("career", {
		length: 256,
	}).notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
	_id: z.string().optional(),
	name: z.string().min(3).max(256),
	lastName: z.string().min(3).max(256),
	phone: z.string().min(10).max(13),
	username: z.string().min(3).max(32),
	password: z.string().min(8),
	email: z.string().email(),
	matricula: z.string().min(9).max(9),
	career: z.string().min(3).max(256),
});
export type InsertUser = typeof users.$inferInsert;
export type User = Omit<typeof users.$inferSelect, "password">;

export const usersRelations = relations(users, ({ many }) => ({
	complaints: many(complaints),
}));

export const statusEnum = pgEnum("status", [
	"PENDING",
	"IN_PROGRESS",
	"RESOLVED",
]);

export const complaints = pgTable("complaints", {
	_id: uuid("_id").primaryKey(),
	title: varchar("title", {
		length: 256,
	}).notNull(),
	description: varchar("description", {
		length: 512,
	}).notNull(),
	status: statusEnum("status").notNull().default("PENDING"),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("update_at").notNull().defaultNow(),
	at: timestamp("at"),
	location: varchar("location", {
		length: 256,
	}),
	isAnonymous: boolean("is_anonymous").notNull().default(true),
});

export const insertComplaintSchema = createInsertSchema(complaints, {
	_id: z.string().optional(),
	title: z.string().min(3).max(256),
	description: z.string().min(3).max(512),
	userId: z.string().uuid(),
	location: z.string().max(256).optional(),
	at: z.string().optional(),
	isAnonymous: z.boolean(),
});

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = typeof complaints.$inferInsert;

export const complaintsRelations = relations(complaints, ({ one, many }) => ({
	user: one(users, {
		fields: [complaints.userId],
		references: [users._id],
	}),
	replies: many(replies),
}));

export const replies = pgTable("replies", {
	_id: uuid("_id").primaryKey(),
	complaintId: uuid("complaint_id").notNull(),
	userId: uuid("user_id").notNull(),
	description: varchar("description", {
		length: 512,
	}).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const repliesRelations = relations(replies, ({ one }) => ({
	complaint: one(complaints, {
		fields: [replies.complaintId],
		references: [complaints._id],
	}),
}));
