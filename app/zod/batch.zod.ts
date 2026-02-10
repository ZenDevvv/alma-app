import { z } from "zod";
import type { StockItem, StockItemWithRelations } from "./stock-items.zod";
import type { Pagination } from "~/types/pagination";

// Base schema with all fields
export const BatchSchema = z.object({
	id: z.string(),
	batchNumber: z.string().min(1, "Batch number is required"),
	receivedAt: z.date(),
	receivedById: z.string().nullable().optional(), // ObjectId reference
	date: z.date(),
	asp: z.number().positive(),
	isDeleted: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// For creating a new batch (without auto-generated fields)
export const CreateBatchSchema = BatchSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// For updating an existing batch
export const UpdateBatchSchema = z.object({
	batchNumber: z.string().min(1, "Batch number is required").optional(),
	receivedAt: z.date().optional(),
	receivedById: z.string().nullable().optional(), // ObjectId reference
	date: z.date().optional(),
	isDeleted: z.boolean().optional(),
});

// Type exports
export type Batch = z.infer<typeof BatchSchema>;
export type CreateBatch = z.infer<typeof CreateBatchSchema>;
export type UpdateBatch = z.infer<typeof UpdateBatchSchema>;

export type BatchWithRelations = Batch & {
	stocks: StockItemWithRelations[];
};

export type GetAllBatches = {
	batchs: BatchWithRelations[];
	pagination: Pagination;
	count: number;
};
