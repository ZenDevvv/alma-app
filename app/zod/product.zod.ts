import { z } from "zod";
import type { Category } from "./category.zod";
import type { Pagination } from "~/types/pagination";
import type { ProductType } from "./product-type.zod";

// Status enum
export const StatusEnum = z.enum(["active", "inactive", "discontinued", "critical"]);

// Storage Type enum
export const StorageTypeEnum = z.enum(["roomTemperature", "refrigerated", "controlled", "frozen"]);

// Unit of Measure enum
export const UnitOfMeasureEnum = z.enum([
	"piece",
	"tablet",
	"capsule",
	"box",
	"bottle",
	"vial",
	"pack",
	"tube",
	"strip",
	"carton",
	"bag",
	"unit",
]);

// Product Schema (full, including ID)
export const ProductSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Product name is required"),
	description: z.string().optional().nullable(),
	gtin: z.string().optional().nullable(),
	sku: z.string(),
	srp: z.number().positive(),
	unitOfMeasure: UnitOfMeasureEnum,
	quantityPerBox: z.number().int().positive().optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	status: StatusEnum,
	categoryId: z.string(),
	productTypeId: z.string(),
	requiresPrescription: z.boolean().default(false),
	storageRequirement: z.string().min(1, "Storage requirement is required"),
	reorderLevel: z.number().int().positive("Reorder level must be positive").max(100),
	maxStockLevel: z.number().int().positive("Max stock level must be positive"),
	supplierItemId: z.string().optional().nullable(),
	isDeleted: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductSchema>;

// Create Product Schema
export const CreateProductSchema = ProductSchema.omit({
	id: true,
	gtin: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial({
	description: true,
	quantityPerBox: true,
	supplierItemId: true,
	requiresPrescription: true, // ✅ Add this to make it explicitly optional
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;

// Update Product Schema
export const UpdateProductSchema = ProductSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export type ProductWithRelation = Product & { category: Category; productType: ProductType };

export type GetAllProducts = {
	products: ProductWithRelation[];
	pagination: Pagination;
	count: number;
};
