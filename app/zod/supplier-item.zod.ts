import { z } from "zod";
import type { ProductWithRelation } from "./product.zod";
import type { Pagination } from "~/types/pagination";

// SupplierItem Schema (full, including ID)
export const SupplierItemSchema = z.object({
	id: z.string(),
	asp: z.number().positive("ASP must be a positive number"),
	srp: z.number().positive("SRP must be a positive number"),
	quantity: z
		.number()
		.int()
		.nonnegative("Quantity must be a non-negative integer")
		.nullable()
		.optional(),
	supplierId: z.string(),
	priceId: z
		.string()

		.nullable()
		.optional(),
	productId: z.string(),
	isDeleted: z.boolean().default(false),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type SupplierItem = z.infer<typeof SupplierItemSchema>;

// Create SupplierItem Schema (excluding ID, createdAt, updatedAt)
export const CreateSupplierItemSchema = z.object({
	asp: z.number().positive("ASP must be a positive number"),
	srp: z.number().positive("SRP must be a positive number"),
	quantity: z.number().int().nonnegative("Quantity must be a non-negative integer").optional(),
	supplierId: z.string(),
	priceId: z
		.string()

		.optional(),
	productId: z.string(),
});

export type CreateSupplierItem = z.infer<typeof CreateSupplierItemSchema>;

// Update SupplierItem Schema (partial, excluding immutable fields)
export const UpdateSupplierItemSchema = z
	.object({
		asp: z.number().positive("ASP must be a positive number").optional(),
		srp: z.number().positive("SRP must be a positive number").optional(),
		quantity: z
			.number()
			.int()
			.nonnegative("Quantity must be a non-negative integer")
			.nullable()
			.optional(),
		priceId: z
			.string()

			.nullable()
			.optional(),
	})
	.strict();

export type UpdateSupplierItem = z.infer<typeof UpdateSupplierItemSchema>;

// Query/Filter Schema
export const QuerySupplierItemSchema = z.object({
	groupBy: z.string().optional(),
});

export type QuerySupplierItem = z.infer<typeof QuerySupplierItemSchema>;

export type SupplierItemWithRelation = SupplierItem & { product: ProductWithRelation };

export type GetAllSupplierItems = {
	supplierItems: SupplierItem[];
	pagination: Pagination;
	count: number;
};
