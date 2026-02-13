import type { Course } from "~/zod/course.zod";

type CourseStatus = Course["status"];
type CourseLevel = Course["level"];

export const courseStatusBadgeClass: Record<CourseStatus, string> = {
	active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
	archived:
		"border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
	draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
	pending_approval:
		"border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
};

export const courseStatusLabel: Record<CourseStatus, string> = {
	active: "Active",
	archived: "Archived",
	draft: "Draft",
	pending_approval: "Pending Approval",
};

export const courseLevelLabel: Record<CourseLevel, string> = {
	beginner: "Beginner",
	intermediate: "Intermediate",
	advanced: "Advanced",
	all_levels: "All Levels",
};

export const formatUpdatedBy = (updatedBy?: string) => {
	if (!updatedBy || updatedBy === "-") return "-";
	return updatedBy.length > 8 ? `${updatedBy.slice(0, 8)}...` : updatedBy;
};
