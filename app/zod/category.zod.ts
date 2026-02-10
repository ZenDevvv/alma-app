import { z } from "zod";
import type { Pagination } from "~/types/pagination";

// Category Schema (full, including ID)
export const CategorySchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string().optional(),
	isDeleted: z.boolean().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

// Create Category Schema (excluding ID, createdAt, updatedAt, and computed fields)
export const CreateCategorySchema = CategorySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	type: true,
	isDeleted: true,
});

export type CreateTemplate = z.infer<typeof CreateCategorySchema>;

// Update Category Schema (partial, excluding immutable fields and relations)
export const UpdateCategorySchema = CategorySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GroupBySchema = z.object({
	groupBy: z.string().optional(),
});

export type UpdateTemplate = z.infer<typeof UpdateCategorySchema>;

export interface GetAllCategories {
	categorys: Category[];
	pagination: Pagination;
	count: number;
}
