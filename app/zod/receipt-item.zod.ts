import { z } from "zod";
import type { DeliveryOrderItemWithRelation } from "./order-item.zod";

// Helper for date parsing
const dateSchema = z.coerce.date();
// DeliveryReceiptItem Schema (full, matching Prisma model)
export const DeliveryReceiptItemSchema = z.object({
		id: z.string(),
	deliveryOrderItemId: z.string().nullable().optional(),
	receivedQuantity: z.number().int().nullable().optional(),
	approvedQuantity: z.number().int().nullable().optional(),
	rejectedQuantity: z.number().int().nullable().optional(),
	inspectionNotes: z.string().nullable().optional(),
	condition: z.string().nullable().optional(),
	photos: z.array(z.string()).default([]),
	inspectedAt: dateSchema.nullable().optional(),
	isDeleted: z.boolean().default(false),
	createdAt: dateSchema.optional(),
	updatedAt: dateSchema.optional(),
});

export type DeliveryReceiptItem = z.infer<typeof DeliveryReceiptItemSchema>;

// Create DeliveryReceiptItem Schema (for creating new items)
export const CreateDeliveryReceiptItemSchema = z.object({
	deliveryReceiptId: z.string(),
	deliveryOrderItemId: z.string().optional(),
	receivedQuantity: z.number().int().optional(),
	approvedQuantity: z.number().int().optional(),
	rejectedQuantity: z.number().int().optional(),
	inspectionNotes: z.string().optional(),
	condition: z.string().optional(),
	photos: z.array(z.string()).default([]),
	inspectedAt: dateSchema.optional(),
	isDeleted: z.boolean().default(false).optional(),
});

export type CreateDeliveryReceiptItem = z.infer<typeof CreateDeliveryReceiptItemSchema>;

// Update DeliveryReceiptItem Schema (partial updates, excluding immutable fields)
export const UpdateDeliveryReceiptItemSchema = z
	.object({
		deliveryOrderItemId: z.string().optional(),
		receivedQuantity: z.number().int().optional(),
		approvedQuantity: z.number().int().optional(),
		rejectedQuantity: z.number().int().optional(),
		inspectionNotes: z.string().optional(),
		condition: z.string().optional(),
		photos: z.array(z.string()).optional(),
		inspectedAt: dateSchema.optional(),
		isDeleted: z.boolean().optional(),
	})
	.partial();

export type UpdateDeliveryReceiptItem = z.infer<typeof UpdateDeliveryReceiptItemSchema>;

export const GroupBySchema = z.object({
	groupBy: z.string().optional(),
});

export type ReceiptItemWithRelation = DeliveryReceiptItem & {
	deliveryOrderItem: DeliveryOrderItemWithRelation;
};
