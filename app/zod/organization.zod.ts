import { z } from "zod";
import type { Pagination } from "~/types/pagination";

export const OrganizationSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string().optional(),
	code: z.string().min(1),
	isDeleted: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const OrganizationWithRelationSchema = OrganizationSchema.extend({});

export const GetAllOrganizationsSchema = z.object({
	organizations: z.array(OrganizationWithRelationSchema),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
	count: z.number().optional(),
});

export const CreateOrganizationSchema = OrganizationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	isDeleted: true,
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export type Organization = z.infer<typeof OrganizationSchema>;
export type OrganizationWithRelation = z.infer<typeof OrganizationWithRelationSchema>;
export type GetAllOrganizations = z.infer<typeof GetAllOrganizationsSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
export type OrganizationPagination = Pagination;
