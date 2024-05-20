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
	})
		.notNull()
		.unique(),
	password: varchar("password").notNull(),
	role: roleEnum("role").notNull().default("USER"),
	email: varchar("email", {
		length: 256,
	})
		.notNull()
		.unique(),
	matricula: varchar("matricula", {
		length: 9,
	}).notNull(),
	career: varchar("career", {
		length: 256,
	}).notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
	_id: z.string().optional(),
	name: z
		.string()
		.min(3, "El nombre debe contener al menos 3 caracteres")
		.max(256),
	lastName: z
		.string()
		.min(3, "Los apellidos deben contener al menos 3 caracteres")
		.max(256),
	phone: z
		.string()
		.min(10, "El número de teléfono debe tener al menos 10 dígitos")
		.max(13, "El número de teléfono debe tener máximo 13 dígitos"),
	username: z
		.string()
		.min(3, "El nombre de usuario debe contener al menos 3 caracteres")
		.max(32),
	password: z
		.string()
		.min(8, "La contraseña debe contener al menos 8 caracteres"),
	email: z
		.string()
		.email("El correo no puede estar vacío y debe tener un formato válido")
		.endsWith(".buap.mx", "El correo debe ser institucional"),
	matricula: z
		.string()
		.min(9, "La matrícula debe contener 9 dígitos")
		.max(9, "La matrícula debe contener 9 dígitos"),
	career: z
		.string()
		.min(3, "El nombre de la carrera debe contener al menos 3 caracteres")
		.max(256, "El nombre de la carrera debe contener máximo 256 caracteres"),
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
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("update_at").notNull(),
	at: timestamp("at"),
	location: varchar("location", {
		length: 256,
	}),
	isAnonymous: boolean("is_anonymous").notNull().default(true),
});

export const insertComplaintSchema = createInsertSchema(complaints, {
	_id: z.string().optional(),
	title: z.string().min(3, "Este campo es necesario").max(256),
	description: z
		.string()
		.min(3, "Por favor provea algo más de información")
		.max(512),
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
	isAnonymous: boolean("is_anonymous").notNull().default(true),
});

export type Reply = typeof replies.$inferSelect;
export type InsertReply = typeof replies.$inferInsert;

export const insertReplySchema = createInsertSchema(replies, {
	_id: z.string().uuid(),
	complaintId: z.string().uuid(),
	userId: z.string().uuid(),
	description: z
		.string()
		.min(3, "La descripción debe contener al menos 3 caracteres")
		.max(512),
	isAnonymous: z.boolean(),
});

export const repliesRelations = relations(replies, ({ one }) => ({
	complaint: one(complaints, {
		fields: [replies.complaintId],
		references: [complaints._id],
	}),
}));
