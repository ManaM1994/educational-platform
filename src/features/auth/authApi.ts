import axiosInstance from '@/lib/axios';

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
  profile_picture: string | null;
  has_tutor_profile: boolean;
  tutor_id: number | null;
  tutor_approved: boolean | null;
  phone_number: string;
  bio: string;
}

export interface LoginResponse {
  ok: boolean;
  access: string;
  refresh: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post<UserData>('/register/', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axiosInstance.post<LoginResponse>('/login/', data);
    return response.data;
  },

  me: async () => {
    const response = await axiosInstance.get<UserData>('/me/');
    return response.data;
  },

  logout: async () => {
    await axiosInstance.post('/logout/');
  },

  refreshToken: async (refresh: string) => {
    const response = await axiosInstance.post<{ access: string }>('/auth/token/refresh/', { refresh });
    return response.data;
  },
};
