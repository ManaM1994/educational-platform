import axiosInstance from '@/lib/axios';
import { Course } from '@/types';

export const coursesApi = {
  getAll: async (params?: { 
    language?: string;
    level?: string;
    schedule_day?: string;
    search?: string;
    ordering?: 'price_per_hour' | '-price_per_hour' | 'price_per_dollar' | '-price_per_dollar' | 'price_per_toman' | '-price_per_toman' | 'title' | '-title';
  }) => {
    const { data } = await axiosInstance.get<Course[]>('/courses/', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await axiosInstance.get<Course>(`/courses/${id}/`);
    return data;
  },

  getPopular: async (limit: number = 6) => {
    const { data } = await axiosInstance.get<Course[]>('/courses/', {
      params: { ordering: 'title' }
    });
    return data.slice(0, limit);
  },
};
