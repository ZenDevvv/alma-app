import { z } from "zod";
import type { DeliveryItemWithRelation } from "./request-item.zod";
import type { SupplierItemWithRelation } from "./supplier-item.zod";
import type { ProductWithRelation } from "./product.zod";

// DeliveryOrderItem Schema (full, including ID)
export const DeliveryOrderItemSchema = z.object({
	id: z.string(),
	productId: z.string(),
	asp: z.number().positive().optional(),
	expiryDate: z.coerce.date().nullable().optional(),
	batchNumber: z.string(),
	quantity: z.number().int(),
	notes: z.string().optional(),
	orderId: z
		.string()

		.nullable()
		.optional(),
	batchId: z
		.string()

		.nullable()
		.optional(),
	requestItemId: z
		.string()

		.nullable()
		.optional(),
	supplierItemId: z
		.string()

		.nullable()
		.optional(),
	isDeleted: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type DeliveryOrderItem = z.infer<typeof DeliveryOrderItemSchema>;

// Create DeliveryOrderItem Schema (excluding ID, createdAt, updatedAt, and computed fields)
export const CreateDeliveryOrderItemSchema = DeliveryOrderItemSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	notes: true,
	isDeleted: true,
});

export type CreateDeliveryOrderItem = z.infer<typeof CreateDeliveryOrderItemSchema>;

// Update DeliveryOrderItem Schema (partial, excluding immutable fields and relations)
export const UpdateDeliveryOrderItemSchema = DeliveryOrderItemSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
	orderId: true, // orderId shouldn't be updated after creation
	requestItemId: true, // requestItemId shouldn't be updated after creation (it's unique)
}).partial();

export type UpdateDeliveryOrderItem = z.infer<typeof UpdateDeliveryOrderItemSchema>;

export type DeliveryOrderItemWithRelation = DeliveryOrderItem & {
	requestItem: DeliveryItemWithRelation;
	product: ProductWithRelation;
};
