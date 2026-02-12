import { useMutation, useQuery } from "@tanstack/react-query";
import courseService from "~/services/course-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreateCourse, UpdateCourse } from "~/zod/course.zod";
import { queryClient } from "~/lib/query-client";

export const useGetCourses = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["courses", apiParams],
		queryFn: () => {
			return courseService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllCourses();
		},
	});
};

export const useGetCourseById = (courseId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["course-by-id", courseId, apiParams],
		queryFn: () => {
			return courseService.select(apiParams?.fields || "").getCourseById({ courseId });
		},
		enabled: !!courseId,
	});
};

export const useCreateCourse = () => {
	return useMutation({
		mutationFn: (data: CreateCourse | FormData) => {
			return courseService.createCourse(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
};

export const useUpdateCourse = () => {
	return useMutation({
		mutationFn: ({
			courseId,
			data,
		}: {
			courseId: string;
			data: UpdateCourse | FormData;
		}) => {
			return courseService.updateCourse({ courseId, data });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
};

export const useDeleteCourse = () => {
	return useMutation({
		mutationFn: ({ courseId }: { courseId: string }) => {
			return courseService.deleteCourse({ courseId });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
};
