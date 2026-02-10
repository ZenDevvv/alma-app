import { z } from "zod";
import type { Pagination } from "~/types/pagination";
import type { Product, ProductWithRelation } from "./product.zod";
import type { SupplierItemWithRelation } from "./supplier-item.zod";

// Address Schema (for nested JSON validation)
export const AddressSchema = z
	.object({
		street: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		postalCode: z.string().optional(),
		country: z.string().optional(),
	})
	.optional();

// Supplier Schema (full, including ID)
export const SupplierSchema = z.object({
	id: z.string(),
	code: z.string().min(1),
	name: z.string().min(1),
	contactPerson: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: AddressSchema,
	paymentTerms: z.string().optional(),
	isActive: z.boolean().default(true),
	rating: z.number().min(0).max(5).optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

// Create Supplier Schema (excluding ID, createdAt, updatedAt)
export const CreateSupplierSchema = SupplierSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	contactPerson: true,
	email: true,
	phone: true,
	address: true,
	paymentTerfms: true,
	isActive: true,
	rating: true,
});

export type CreateSupplier = z.infer<typeof CreateSupplierSchema>;

// Update Supplier Schema (partial, excluding immutable fields)
export const UpdateSupplierSchema = SupplierSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateSupplier = z.infer<typeof UpdateSupplierSchema>;

export type SupplierWithRelation = Supplier & { items: SupplierItemWithRelation[] };

export type GetAllSuppliers = {
	suppliers: SupplierWithRelation[];
	pagination: Pagination;
	count: number;
};
