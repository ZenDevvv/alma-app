import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	CourseWithRelation,
	CreateCourse,
	GetAllCourses,
	UpdateCourse,
} from "~/zod/course.zod";

const { COURSE } = API_ENDPOINTS;

class CourseService extends APIService {
	getAllCourses = async () => {
		try {
			const response: ApiResponse<GetAllCourses> = await apiClient.get(
				`${COURSE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getCourseById = async ({ courseId }: { courseId: string }) => {
		try {
			const response: ApiResponse<CourseWithRelation> = await apiClient.get(
				`${COURSE.GET_BY_ID.replace(":id", courseId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createCourse = async (data: CreateCourse | FormData) => {
		try {
			let response: ApiResponse<CourseWithRelation>;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(COURSE.CREATE, data);
			} else {
				response = await apiClient.post(COURSE.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateCourse = async ({
		courseId,
		data,
	}: {
		courseId: string;
		data: UpdateCourse | FormData;
	}) => {
		try {
			let response: ApiResponse<{ course: CourseWithRelation }>;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					COURSE.UPDATE.replace(":id", courseId),
					data,
				);
			} else {
				response = await apiClient.patch(COURSE.UPDATE.replace(":id", courseId), data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteCourse = async ({ courseId }: { courseId: string }) => {
		try {
			const response: ApiResponse<Record<string, never>> = await apiClient.delete(
				COURSE.DELETE.replace(":id", courseId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new CourseService();
