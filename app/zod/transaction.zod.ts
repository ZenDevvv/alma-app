import { z } from "zod";
import type { Pagination } from "~/types/pagination";
import type { UserWithRelation } from "./user.zod";
import type { Department } from "./department.zod";

// Full Transaction Schema (including ID and system fields)
export const TransactionSchema = z.object({
	id: z.string(),
	transactionNumber: z.string().min(1),
	referenceNumber: z.string().min(1),
	type: z.string().min(1),
	performedById: z.string(),
	fromLocationId: z
		.string()
		.optional()
		.nullable(),
	toLocationId: z.string(),
	performedAt: z.coerce.date(),
	notes: z.string().optional(),
	isDeleted: z.boolean(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Create Transaction Schema (excluding id, createdAt, updatedAt)
export const CreateTransactionSchema = TransactionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	notes: true,
	isDeleted: true,
	fromLocationId: true, // optional in Prisma model
});

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

// Update Transaction Schema (all fields optional, excluding immutable ones)
export const UpdateTransactionSchema = TransactionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;

export type TransactionWithRelation =  Transaction & {
	performedBy: UserWithRelation,
	destination: Department
}

export type GetAllTransactions = {
	transactions: TransactionWithRelation[];
	pagination: Pagination
	count: number;
}