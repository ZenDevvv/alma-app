import { z } from "zod";

export const AddressSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
});

export const IdentificationSchema = z.object({
    idType: z.string().min(1, "ID type is required"),
    idNumber: z.string().min(1, "ID number is required"),
    issuedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid issued date",
    }),
    expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid expiry date",
    }),
});

export const PersonalInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date of birth",
    }),
    placeOfBirth: z.string().min(1, "Place of birth is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    nationality: z.string().min(1, "Nationality is required"),
    height: z.number().positive("Height must be positive"),
    weight: z.number().positive("Weight must be positive"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: AddressSchema,
});

export const CreatePatientSchema = z.object({
    email: z.string().email("Invalid email address"),
    userName: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.literal("user"),
    subRole: z.literal("patient"),
    orgId: z.string().min(1, "Organization is required"),
    departmentId: z.string().min(1, "Department is required"),
    personalInfo: PersonalInfoSchema,
    identification: IdentificationSchema,
});

export type CreatePatientPayload = z.infer<typeof CreatePatientSchema>;
