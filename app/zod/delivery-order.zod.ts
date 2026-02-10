import { z } from "zod";
import type { DeliveryRequestsWithRelation } from "./delivery-request.zod";
import type { Department } from "./department.zod";
import type { SupplierWithRelation } from "./supplier.zod";
import type { Pagination } from "~/types/pagination";
import {
	CreateDeliveryOrderItemSchema,
	type DeliveryOrderItemWithRelation,
} from "./order-item.zod";
import type { UserWithRelation } from "./user.zod";

// Enum for OrderStatus
export const OrderStatusEnum = z.enum(["in_transit", "delivered", "completed"]);

export type OrderStatus = z.infer<typeof OrderStatusEnum>;

// DeliveryOrder Schema (full, including ID and all relations)
export const DeliveryOrderSchema = z.object({
	id: z.string(),
	orderNumber: z.string(),
	type: z.enum(["with_request", "without_request"]).default("with_request"),

	// Source and Destination
	sourceId: z
		.string()

		.nullable(),
	supplierId: z
		.string()

		.nullable(),
	deliveryRequestId: z
		.string()

		.nullable()
		.optional(),
	destinationDepartmentId: z.string(),

	// Status and Priority
	status: OrderStatusEnum.default("in_transit"),

	// Dates
	requiredByDate: z.coerce.date().nullable(),
	expectedDeliveryDate: z.coerce.date().nullable(),
	actualDeliveryDate: z.coerce.date().nullable(),

	// Purpose and Note
	purpose: z.string().nullable(),
	notes: z.string().nullable(),
	specialInstructions: z.string().nullable(),
	rejectionReason: z.string().nullable(),

	// User Actions
	approvedById: z
		.string()

		.nullable(),
	approvedAt: z.coerce.date().nullable(),
	rejectedById: z
		.string()

		.nullable(),
	rejectedAt: z.coerce.date().nullable(),
	preparedById: z
		.string()

		.nullable(),
	preparedAt: z.coerce.date().nullable(),
	dispatchedById: z
		.string()

		.nullable(),
	dispatchedAt: z.coerce.date().nullable(),
	items: z.array(CreateDeliveryOrderItemSchema).min(1, "At least one item is required"),

	// Metadata
	isActive: z.boolean().default(true),
	isDeleted: z.boolean().default(false),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type DeliveryOrder = z.infer<typeof DeliveryOrderSchema>;

// Create DeliveryOrder Schema (excluding ID, createdAt, updatedAt)
export const CreateDeliveryOrderSchema = z.object({
	// Source and Destination
	deliveryRequestId: z
		.string()

		.nullable()
		.optional(),
	sourceId: z
		.string()

		.nullable()
		.optional(),
	supplierId: z
		.string()

		.nullable()
		.optional(),
	destinationId: z
		.string()

		.optional(),

	// Status and Priority
	status: OrderStatusEnum.default("in_transit").optional(),

	requiredByDate: z.coerce.date().nullable().optional(),
	expectedDeliveryDate: z.coerce.date().nullable().optional(),
	actualDeliveryDate: z.coerce.date().nullable().optional(),

	// Purpose and Note
	purpose: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	specialInstructions: z.string().nullable().optional(),
	rejectionReason: z.string().nullable().optional(),

	// User Actions
	preparedById: z
		.string()

		.nullable()
		.optional(),
	dispatchedById: z
		.string()

		.nullable()
		.optional(),

	items: z.array(CreateDeliveryOrderItemSchema).min(1, "At least one item is required"),

	// Metadata
	isActive: z.boolean().default(true).optional(),
	isDeleted: z.boolean().default(false).optional(),
});

export type CreateDeliveryOrder = z.infer<typeof CreateDeliveryOrderSchema>;

// Update DeliveryOrder Schema (partial, excluding immutable fields)
export const UpdateDeliveryOrderSchema = z
	.object({
		orderNumber: z.string().min(1).optional(),

		// Source and Destination
		sourceId: z
			.string()

			.nullable()
			.optional(),
		supplierId: z
			.string()

			.nullable()
			.optional(),
		destinationDepartmentId: z
			.string()

			.optional(),

		// Status and Priority
		status: OrderStatusEnum.optional(),

		// Dates
		requiredByDate: z.coerce.date().nullable().optional(),
		expectedDeliveryDate: z.coerce.date().nullable().optional(),
		actualDeliveryDate: z.coerce.date().nullable().optional(),

		// Purpose and Note
		purpose: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		specialInstructions: z.string().nullable().optional(),
		rejectionReason: z.string().nullable().optional(),

		// User Actions
		approvedById: z
			.string()

			.nullable()
			.optional(),
		approvedAt: z.coerce.date().nullable().optional(),
		rejectedById: z
			.string()

			.nullable()
			.optional(),
		rejectedAt: z.coerce.date().nullable().optional(),
		preparedById: z
			.string()

			.nullable()
			.optional(),
		preparedAt: z.coerce.date().nullable().optional(),
		dispatchedById: z
			.string()

			.nullable()
			.optional(),
		dispatchedAt: z.coerce.date().nullable().optional(),

		// Metadata
		isActive: z.boolean().optional(),
	})
	.strict();

export type UpdateDeliveryOrder = z.infer<typeof UpdateDeliveryOrderSchema>;

// GroupBy Schema
export const GroupBySchema = z.object({
	groupBy: z.string().optional(),
});

export type GroupBy = z.infer<typeof GroupBySchema>;

export type DeliveryOrderWithRelation = DeliveryOrder & {
	deliveryRequest: DeliveryRequestsWithRelation;
	department: Department;
	supplier: SupplierWithRelation;
	destination: Department;
	source: Department;
	preparedBy: UserWithRelation;
	items: DeliveryOrderItemWithRelation[];
};

export interface GetAllDeliveryOrders {
	deliveryOrders: DeliveryOrderWithRelation[];
	pagination: Pagination;
	count: number;
}
