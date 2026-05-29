import axiosInstance from '@/lib/axios';
import { StudentDashboardData, StudentProfileUpdate } from '@/types/student';
import { UserData } from '@/features/auth/authApi';

export const studentApi = {
  getMe: async () => {
    const response = await axiosInstance.get<UserData>('/me/');
    return response.data;
  },

  getDashboard: async () => {
    const response = await axiosInstance.get<StudentDashboardData>('/students/me/dashboard/');
    return response.data;
  },

  updateProfile: async (data: StudentProfileUpdate) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    const response = await axiosInstance.patch('/students/me/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  enrollCourse: async (courseId: number, paymentData: {
    payment_amount: number;
    currency: string;
    payment_note?: string;
    payment_proof: File;
  }) => {
    const formData = new FormData();
    formData.append('course', courseId.toString());
    formData.append('payment_amount', paymentData.payment_amount.toString());
    formData.append('currency', paymentData.currency);
    if (paymentData.payment_note) {
      formData.append('payment_note', paymentData.payment_note);
    }
    formData.append('payment_proof', paymentData.payment_proof);

    const response = await axiosInstance.post('/enrollments/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
