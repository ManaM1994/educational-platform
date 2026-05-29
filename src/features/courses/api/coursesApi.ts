import axiosInstance from "@/lib/axios";
import { Course, Enrollment, CreateEnrollmentInput } from "@/types";

export const coursesApi = {
  getAllCourses: async (params?: {
    language?: string;
    level?: string;
    schedule_day?: string;
    search?: string;
    ordering?: string;
  }) => {
    const { data } = await axiosInstance.get<Course[]>("/courses/", { params });
    return data;
  },

  getCourseById: async (id: number) => {
    const { data } = await axiosInstance.get<Course>(`/courses/${id}/`);
    return data;
  },

  createEnrollment: async (enrollmentData: CreateEnrollmentInput) => {
    const formData = new FormData();
    formData.append("course", enrollmentData.course.toString());
    formData.append("payment_amount", enrollmentData.payment_amount.toString());
    formData.append("currency", enrollmentData.currency);
    if (enrollmentData.payment_note) {
      formData.append("payment_note", enrollmentData.payment_note);
    }
    formData.append("payment_proof", enrollmentData.payment_proof);

    const { data } = await axiosInstance.post<Enrollment>(
      "/enrollments/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  getMyEnrollments: async () => {
    const { data } = await axiosInstance.get<Enrollment[]>("/enrollments/my/");
    return data;
  },
};
