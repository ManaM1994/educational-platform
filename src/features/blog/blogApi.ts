import axiosInstance from '@/lib/axios';
import { BlogPost } from '@/types';

export const blogApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<BlogPost[]>('/blogs/');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await axiosInstance.get<BlogPost>(`/blogs/${id}/`);
    return data;
  },

  getLatest: async (limit: number = 3) => {
    const { data } = await axiosInstance.get<BlogPost[]>('/blogs/');
    return data.slice(0, limit);
  },
};
