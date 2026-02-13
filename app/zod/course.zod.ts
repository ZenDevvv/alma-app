import { z } from "zod";
import { OrganizationSchema } from "./organization.zod";
import { FacultySchema } from "./faculty.zod";
import { ProgramSchema } from "./program.zod";
import { CategorySchema } from "./category.zod";
import { ObjectIdSchema } from "./object-id.zod";
import { PaginationSchema } from "./common.zod";

export const CourseStatus = z.enum(["draft", "pending_approval", "active", "archived"]);
export const CourseLevel = z.enum(["beginner", "intermediate", "advanced", "all_levels"]);

export const CourseSchema = z.object({
	id: ObjectIdSchema,
	title: z.string().min(1),
	code: z.string().min(1),
	description: z.string().optional(),
	status: CourseStatus.default("draft"),
	level: CourseLevel.default("all_levels"),
	creditHours: z.number().optional(),
	thumbnail: z.string().optional(),
	syllabus: z.string().optional(),
	version: z.number().int(),

	// Foreign key IDs
	orgId: ObjectIdSchema,
	facultyId: ObjectIdSchema.optional(),
	programId: ObjectIdSchema.optional(),
	categoryId: ObjectIdSchema.optional(),

	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional(),
	updatedBy: ObjectIdSchema.optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),

	// Relation fields (only where this model owns the foreign key)
	organization: OrganizationSchema.optional(),
	faculty: FacultySchema.optional(),
	program: ProgramSchema.optional(),
	category: CategorySchema.optional(),
});

export type Course = z.infer<typeof CourseSchema>;
export type CourseWithRelation = Course;

export const GetAllCoursesSchema = z.object({
	courses: z.array(CourseSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type GetAllCourses = z.infer<typeof GetAllCoursesSchema>;

export const CreateCourseSchema = CourseSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	version: true,
	organization: true,
	faculty: true,
	program: true,
	category: true,
}).partial({
	description: true,
	status: true,
	level: true,
	creditHours: true,
	thumbnail: true,
	syllabus: true,
	facultyId: true,
	programId: true,
	categoryId: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export type CreateCourse = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = CourseSchema.omit({
	id: true,
	orgId: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
	createdBy: true,
	organization: true,
	faculty: true,
	program: true,
	category: true,
}).partial();

export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;

export const AddPrerequisiteSchema = z.object({
	prerequisiteId: ObjectIdSchema,
});

export type AddPrerequisite = z.infer<typeof AddPrerequisiteSchema>;
