import { z } from "zod";
import { DeliveryReceiptItemSchema, type DeliveryReceiptItem } from "./receipt-item.zod";
import type { DeliveryOrderWithRelation } from "./delivery-order.zod";
import type { UserWithRelation } from "./user.zod";
import type { Pagination } from "~/types/pagination";
import type { DeliveryRequestsWithRelation } from "./delivery-request.zod";

export const DeliveryReceiptStatusEnum = z.enum(["pending", "partial", "completed", "rejected"]);
export const ConditionEnum = z.enum(["good", "damaged"]);

export const DeliveryReceiptSchema = z.object({
	id: z.string(),
	receiptNumber: z.string().min(1, "Receipt number is required"),

	deliveryRequestId: z.string().nullable().optional(),
	deliveryOrderId: z.string(),

	receivedDate: z.coerce.date(),

	receivedById: z.string(),

	inspectedById: z.string().nullable().optional(),

	condition: ConditionEnum.nullable().optional(),
	inspectionNotes: z.string().nullable().optional(),
	discrepancyReported: z.boolean(),
	discrepancyDetails: z.string().nullable().optional(),

	attachments: z.array(z.string()),

	receiverSignature: z.string().nullable().optional(),
	delivererSignature: z.string().nullable().optional(),

	items: z.array(DeliveryReceiptItemSchema).optional(),

	isActive: z.boolean(),
	isDeleted: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),

	userId: z.string().nullable().optional(),
});

export type DeliveryReceipt = z.infer<typeof DeliveryReceiptSchema>;
export type DeliveryReceiptStatus = z.infer<typeof DeliveryReceiptStatusEnum>;
export type Condition = z.infer<typeof ConditionEnum>;

export const CreateDeliveryReceiptSchema = DeliveryReceiptSchema.omit({
	id: true,
	receiptNumber: true,
	createdAt: true,
	updatedAt: true,
}).extend({
	receivedDate: z.coerce.date().default(() => new Date()),
	discrepancyReported: z.boolean().default(false),
	attachments: z.array(z.string()).default([]),
	isActive: z.boolean().default(true),
	isDeleted: z.boolean().default(false),
});

export type CreateDeliveryReceipt = z.infer<typeof CreateDeliveryReceiptSchema>;

export const UpdateDeliveryReceiptSchema = DeliveryReceiptSchema.omit({
	id: true,
	receiptNumber: true,
	deliveryOrderId: true,
	receivedById: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateDeliveryReceipt = z.infer<typeof UpdateDeliveryReceiptSchema>;

export type DeliveryReceiptWithRelation = DeliveryReceipt & {
	deliveryRequest: DeliveryRequestsWithRelation;
	deliveryOrder: DeliveryOrderWithRelation;
	receivedBy: UserWithRelation;
	inspectedBy: UserWithRelation;
	items: DeliveryReceiptItem;
};

export interface GetAllDeliveryReceipts {
	deliveryReceipts: DeliveryReceiptWithRelation[];
	pagination: Pagination;
	count: number;
}
