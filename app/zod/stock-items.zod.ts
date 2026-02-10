import { z } from "zod";
import type { ProductWithRelation } from "./product.zod";
import type { InventoryRecord, InventoryRecordWithRelations } from "./stock-record.zod";

// Base schema for StockMovementItem
export const StockItemSchema = z.object({
	id: z.string(),
	
	productNumber: z.string(),
	inventoryRecordId: z.string(),
	productId: z.string(),
	batchId: z.string().nullable().optional(),
	quantity: z.number().int(),
	unitCost: z.number().nullable().optional(),
	totalCost: z.number().nullable().optional(),
	fromLocationId: z.string().nullable().optional(),
	toLocationId: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	isDeleted: z.boolean().default(false),
	expiryDate: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Schema for creating a new StockMovementItem (excludes auto-generated fields)
export const CreateStockItemSchema = z.object({
	inventoryRecordId: z.string(),
	productId: z.string(),
	batchId: z.string().nullable().optional(),
	quantity: z.number().int().positive("Quantity must be positive"),
	unitCost: z.number().nonnegative().nullable().optional(),
	totalCost: z.number().nonnegative().nullable().optional(),
	fromLocationId: z.string().nullable().optional(),
	toLocationId: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	isDeleted: z.boolean().optional().default(false),
});

// Schema for updating a StockMovementItem (all fields optional except id)
export const UpdateStockItemSchema = z.object({
	id: z.string(),
	inventoryRecordId: z.string().optional(),
	productId: z.string().optional(),
	batchId: z.string().nullable().optional(),
	quantity: z.number().int().positive().optional(),
	unitCost: z.number().nonnegative().nullable().optional(),
	totalCost: z.number().nonnegative().nullable().optional(),
	fromLocationId: z.string().nullable().optional(),
	toLocationId: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	isDeleted: z.boolean().optional(),
});

// Type exports
export type StockItem = z.infer<typeof StockItemSchema>;
export type CreateStockItem = z.infer<typeof CreateStockItemSchema>;
export type UpdateStockItem = z.infer<typeof UpdateStockItemSchema>;

export type StockItemWithRelations = StockItem & {
    product: ProductWithRelation
    inventoryRecord: InventoryRecordWithRelations
}
