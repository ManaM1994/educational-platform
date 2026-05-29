import axiosInstance from "@/lib/axios";
import {
  Tutor,
  TutorDashboardData,
  CreateTutorProfileInput,
  TutorCourse,
  Review,
  TutorCertificate,
  TutorEducation,
  TutorExperience,
} from "@/types";

export const tutorApi = {
  getMyDashboard: async () => {
    const { data } = await axiosInstance.get<TutorDashboardData>(
      "/tutors/me/dashboard/",
    );
    return data;
  },

  createProfile: async (input: CreateTutorProfileInput) => {
    const formData = new FormData();

    if (input.first_name) formData.append("first_name", input.first_name);
    if (input.last_name) formData.append("last_name", input.last_name);
    if (input.phone_number) formData.append("phone_number", input.phone_number);
    if (input.country) formData.append("country", input.country);

    formData.append("subjects", JSON.stringify(input.subjects));

    if (input.languages_spoken) {
      formData.append(
        "languages_spoken",
        JSON.stringify(input.languages_spoken),
      );
    }

    if (input.profile_picture) {
      formData.append("profile_picture", input.profile_picture);
    }

    if (input.certificates) {
      const certificates = input.certificates.map((certificate) => ({
        ...certificate,
        issue_date: certificate.issue_date || null,
        certificate_image: null,
      }));
      formData.append("certificates", JSON.stringify(certificates));
    }

    if (input.educations) {
      const educations = input.educations.map((education) => ({
        ...education,
        start_date: education.start_date || null,
        end_date: education.end_date || null,
      }));
      formData.append("educations", JSON.stringify(educations));
    }

    if (input.bio) formData.append("bio", input.bio);
    if (input.teaching_style)
      formData.append("teaching_style", input.teaching_style);
    if (input.expectation) formData.append("expectation", input.expectation);
    if (input.description) formData.append("description", input.description);
    if (input.intro_video_url)
      formData.append("intro_video_url", input.intro_video_url);

    if (input.intro_video_file) {
      formData.append("intro_video_file", input.intro_video_file);
    }

    const { data } = await axiosInstance.post<Tutor>(
      "/create-tutor-profile/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },

  updateProfile: async (tutorId: number, profileData: Partial<Tutor>) => {
    const { data } = await axiosInstance.patch<Tutor>(
      `/tutors/${tutorId}/`,
      profileData,
    );
    return data;
  },

  getTutorCourses: async (tutorId?: number) => {
    const params = tutorId ? { tutor: tutorId } : {};
    const { data } = await axiosInstance.get<TutorCourse[]>("/tutor-courses/", {
      params,
    });
    return data;
  },

  createTutorCourse: async (courseData: TutorCourse) => {
    const { data } = await axiosInstance.post<TutorCourse>(
      "/tutor-courses/",
      courseData,
    );

    return data;
  },

  updateTutorCourse: async (id: number, courseData: Partial<TutorCourse>) => {
    const { data } = await axiosInstance.patch<TutorCourse>(
      `/tutor-courses/${id}/`,
      courseData,
    );
    return data;
  },

  deleteTutorCourse: async (id: number) => {
    await axiosInstance.delete(`/tutor-courses/${id}/`);
  },

  getReviews: async (tutorId: number) => {
    const { data } = await axiosInstance.get<Review[]>("/reviews/", {
      params: { tutor: tutorId },
    });
    return data;
  },

  createCertificate: async (
    certData: Omit<TutorCertificate, "id" | "tutor">,
  ) => {
    const { data } = await axiosInstance.post<TutorCertificate>(
      "/tutor-certificates/",
      certData,
    );
    return data;
  },

  updateCertificate: async (
    id: number,
    certData: Partial<TutorCertificate>,
  ) => {
    const { data } = await axiosInstance.patch<TutorCertificate>(
      `/tutor-certificates/${id}/`,
      certData,
    );
    return data;
  },

  deleteCertificate: async (id: number) => {
    await axiosInstance.delete(`/tutor-certificates/${id}/`);
  },

  createEducation: async (eduData: Omit<TutorEducation, "id" | "tutor">) => {
    const { data } = await axiosInstance.post<TutorEducation>(
      "/tutor-educations/",
      eduData,
    );
    return data;
  },

  updateEducation: async (id: number, eduData: Partial<TutorEducation>) => {
    const { data } = await axiosInstance.patch<TutorEducation>(
      `/tutor-educations/${id}/`,
      eduData,
    );
    return data;
  },

  deleteEducation: async (id: number) => {
    await axiosInstance.delete(`/tutor-educations/${id}/`);
  },

  createExperience: async (expData: Omit<TutorExperience, "id" | "tutor">) => {
    const { data } = await axiosInstance.post<TutorExperience>(
      "/tutor-experiences/",
      expData,
    );
    return data;
  },

  updateExperience: async (id: number, expData: Partial<TutorExperience>) => {
    const { data } = await axiosInstance.patch<TutorExperience>(
      `/tutor-experiences/${id}/`,
      expData,
    );
    return data;
  },

  deleteExperience: async (id: number) => {
    await axiosInstance.delete(`/tutor-experiences/${id}/`);
  },
};
