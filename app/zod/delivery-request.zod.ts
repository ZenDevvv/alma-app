import { z } from "zod";
import type { Department } from "./department.zod";
import type { UserWithRelation } from "./user.zod";
import { DeliveryItemSchema, type DeliveryItemWithRelation } from "./request-item.zod";
import type { Pagination } from "~/types/pagination";

export const DeliveryStatusSchema = z.enum([
	"draft",
	"new",
	"for_approval",
	"approved",
	"rejected",
	"pending",
	"partially_delivered",
	"completed",
	"cancelled",
	"in_progress",
]);

export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;

// Schema for updating items within a delivery update
export const UpdateDeliveryItemInRequestSchema = z.object({
	id: z.string(),
	// All fields optional - update only what you need
	approvedQuantity: z.number().int().min(0).optional(),
	deliveredQuantity: z.number().int().min(0).optional(),
	requestedQuantity: z.number().int().min(0).optional(),
	notes: z.string().optional(),
	itemStatus: z.enum(["pending", "packed", "delivered", "partial"]).optional(),
	batchNumber: z.string().optional(),
	expiryDate: z.coerce.date().optional(),
	serialNumbers: z.array(z.string()).optional(),
	batchId: z.string().optional(),
});

export type UpdateDeliveryItemInRequest = z.infer<typeof UpdateDeliveryItemInRequestSchema>;

export const PrioritySchema = z.enum(["urgent", "high", "normal", "low"]);
export type Priority = z.infer<typeof PrioritySchema>;

// Main DeliveryRequest Schema (aligned with Prisma model)
export const DeliveryRequestSchema = z.object({
	id: z.string(),

	requestNumber: z.string(),

	// Source can be either sourceId OR supplierId (not both)
	sourceId: z.string().optional().nullable(),
	supplierId: z.string().optional().nullable(),

	// Destination is required
	destinationId: z.string(),

	status: DeliveryStatusSchema.default("new"),
	priority: PrioritySchema,

	requestedDate: z.coerce.date().default(() => new Date()),
	requiredByDate: z.coerce.date().optional().nullable(),
	expectedDeliveryDate: z.coerce.date().optional().nullable(),
	actualDeliveryDate: z.coerce.date().optional().nullable(),

	purpose: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	specialInstructions: z.string().optional().nullable(),
	rejectionReason: z.string().optional().nullable(),

	requestedById: z.string(),

	approvedById: z.string().optional().nullable(),
	approvedAt: z.coerce.date().optional().nullable(),

	rejectedById: z.string().optional().nullable(),
	rejectedAt: z.coerce.date().optional().nullable(),

	items: z.array(DeliveryItemSchema).min(1, "At least one item is required"),

	isActive: z.boolean().default(true),
	isDeleted: z.boolean().default(false),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type DeliveryRequest = z.infer<typeof DeliveryRequestSchema>;

export const CreateDeliveryRequestItemSchema = z.object({
	productId: z.string(),
	requestedQuantity: z.number(),
});

// Create schema - omit auto-generated fields
export const CreateDeliveryRequestSchema = DeliveryRequestSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	requestNumber: true,
	items: true,
})
	.extend({
		items: z.array(CreateDeliveryRequestItemSchema),
	})
	.partial({
		sourceId: true,
		supplierId: true,
		status: true,
		priority: true,
		requestedDate: true,
		requiredByDate: true,
		expectedDeliveryDate: true,
		actualDeliveryDate: true,
		purpose: true,
		notes: true,
		specialInstructions: true,
		rejectionReason: true,
		approvedById: true,
		approvedAt: true,
		rejectedById: true,
		rejectedAt: true,
		isActive: true,
		isDeleted: true,
	});

export type CreateDeliveryRequest = z.infer<typeof CreateDeliveryRequestSchema>;

// Update schema - all fields optional except id
export const UpdateDeliveryRequestSchema = DeliveryRequestSchema.omit({
	id: true,
	requestedById: true,
	createdAt: true,
	updatedAt: true,
	items: true,
})
	.extend({
		items: z.array(UpdateDeliveryItemInRequestSchema).optional(),
	})
	.partial();

export type UpdateDeliveryRequest = z.infer<typeof UpdateDeliveryRequestSchema>;

// Legacy exports for backward compatibility
export const DeliverySchema = DeliveryRequestSchema;
export type Delivery = DeliveryRequest;
export const CreateDeliverySchema = CreateDeliveryRequestSchema;
export type CreateDelivery = CreateDeliveryRequest;
export const UpdateDeliverySchema = UpdateDeliveryRequestSchema;
export type UpdateDelivery = UpdateDeliveryRequest;

export type DeliveryRequestsWithRelation = DeliveryRequest & {
	destination: Department;
	source: Department;
	requestedBy: UserWithRelation;
	item: DeliveryItemWithRelation;
};

export interface GetAllDeliveryRequests {
	deliverys: DeliveryRequestsWithRelation[];
	pagination: Pagination;
	count: number;
}
