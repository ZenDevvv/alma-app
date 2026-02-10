import { z } from "zod";
import { TransactionSchema } from "./transaction.zod";
import { PatchStockRecordSchema } from "./stock-record.zod";
import { BatchSchema } from "./batch.zod";
import { DeliveryRequestSchema } from "./delivery-request.zod";
import { DeliveryOrderSchema } from "./delivery-order.zod";
import type { Pagination } from "~/types/pagination";
import { userSchema } from "./user.zod";
import { OrganizationSchema } from "./organization.zod";

// 🔹 Full Department Schema (including relations + system fields)
export const DepartmentSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	code: z.string().min(1),
	orgId: z.string().optional(),
	address: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	postalCode: z.string().nullable().optional(),
	contactName: z.string().nullable().optional(),
	contactPerson: z.string().nullable().optional(),
	contactPhone: z.string().nullable().optional(),
	contactEmail: z.string().nullable().optional(),
	isActive: z.boolean(),
	isDeleted: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),

	// 🔹 Relations
	organization: OrganizationSchema.optional().nullable(),
	transactionsTo: z.array(TransactionSchema).optional(),
	StockRecord: z.array(PatchStockRecordSchema).optional(),
	members: z.array(userSchema).optional(),
	batches: z.array(BatchSchema).optional(),
	sourceDeliveriesRequest: z.array(DeliveryRequestSchema).optional(),
	destinationDeliveriesRequest: z.array(DeliveryRequestSchema).optional(),
	destinationDeliveryOrder: z.array(DeliveryOrderSchema).optional(),
});

export type Department = z.infer<typeof DepartmentSchema>;

// 🔹 Create Department Schema (strict, required core fields, others optional)
export const CreateDepartmentSchema = DepartmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	organization: true,
	transactionsTo: true,
	StockRecord: true,
	members: true,
	batches: true,
	sourceDeliveriesRequest: true,
	destinationDeliveriesRequest: true,
	destinationDeliveryOrder: true,
}).partial({
	address: true,
	city: true,
	state: true,
	country: true,
	postalCode: true,
	contactName: true,
	contactPerson: true,
	contactEmail: true,
	isActive: true,
	isDeleted: true,
});

export type CreateDepartment = z.infer<typeof CreateDepartmentSchema>;

// 🔹 Update Department Schema (all fields optional for partial updates)
export const UpdateDepartmentSchema = DepartmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	organization: true,
	transactionsTo: true,
	StockRecord: true,
	members: true,
	batches: true,
	sourceDeliveriesRequest: true,
	destinationDeliveriesRequest: true,
	destinationDeliveryOrder: true,
}).partial();

export type UpdateDepartment = z.infer<typeof UpdateDepartmentSchema>;

// 🔹 For group by or reporting
export const GroupBySchema = z.object({
	groupBy: z.string().optional(),
});

export interface GetAllDepartments {
	departments: Department[];
	pagination: Pagination;
	count: number;
}
