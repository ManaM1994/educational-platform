import axiosInstance from "@/lib/axios";
import { Tutor } from "@/types";

export const tutorsApi = {
  getAll: async (params?: { user?: number; tutor?: number }) => {
    const { data } = await axiosInstance.get<Tutor[]>("/tutors/", { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await axiosInstance.get<Tutor>(`/tutors/${id}/`);
    return data;
  },

  getFeatured: async (limit: number = 6) => {
    const { data } = await axiosInstance.get<Tutor[]>("/tutors/");
    return data
      .map((tutor) => ({ ...tutor, is_approved: true }))
      .slice(0, limit);
  },
};
