export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface TutorMini {
  id: number;
  user: User;
  profile_picture: string | null;
  languages_spoken: { language: string; level: string }[];
  subjects: string[];
}

export interface Tutor {
  id: number;
  user: User;
  profile_picture: string | null;
  languages_spoken: { language: string; level: string }[];
  subjects: string[];
  country: string;
  phone_number: string;
  bio: string;
  teaching_style: string;
  expectation: string;
  description: string;
  intro_video_url: string;
  intro_video_file: string | null;
  is_approved: boolean;
  certificates: TutorCertificate[];
  educations: TutorEducation[];
  experiences: TutorExperience[];
  courses: TutorCourse[];
}

export interface TutorCertificate {
  id: number;
  tutor: number;
  title: string;
  issued_by: string;
  issue_date: string | null;
  certificate_image: string | null;
}

export interface TutorEducation {
  id: number;
  tutor: number;
  degree: string;
  institution_name: string;
  country: string;
  city: string;
  field: string;
  start_date: string | null;
  end_date: string | null;
}

export interface TutorExperience {
  id: number;
  tutor: number;
  title: string;
  organization: string;
  country: string;
  city: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
}

export interface TutorCourse {
  id: number;
  tutor: number;
  course_title: string;
  duration_minutes: number;
  course_type: 'online' | 'offline';
  price_per_hour: string;
  lesson_package: string;
  language: string;
  days_available: string[];
  time_slots: string[];
  start_date: string;
  description: string;
}

export interface Lesson {
  id: number;
  course: number;
  title: string;
  description: string;
  lesson_video: string | null;
  lesson_document: string | null;
}

export interface Course {
  id: number;
  courseId: string;
  title: string;
  description: string;
  detail: string;
  requirements: string;
  materials: string;
  price_per_hour: string;
  price_per_dollar: string;
  price_per_toman: string;
  language: string;
  level: string;
  schedule_day: string;
  schedule_start: string;
  schedule_end: string;
  capacity: number;
  active_students: number;
  length: number;
  course_duration: string;
  image: string | null;
  language_flag: string | null;
  lessons: Lesson[];
  tutor: TutorMini;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  description: string;
  content: string;
  category: number | null;
  difficulty_level: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  picture: string | null;
}

export interface Review {
  id: number;
  student: {
    id: number;
    user: User;
  };
  tutor: number;
  review_text: string;
  rating: number;
  review_date: string;
}

export interface TutorDashboardStats {
  total_students: number;
  satisfaction_rate: number;
  active_courses: number;
  total_reviews: number;
}

export interface TutorDashboardData {
  tutor: Tutor;
  courses: Course[];
  enrollments: any[];
  stats?: TutorDashboardStats;
}

export interface CreateTutorProfileInput {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  subjects: string[];
  languages_spoken?: { language: string; level: string }[];
  profile_picture?: File | null;
  certificates?: {
    title: string;
    issued_by?: string;
    issue_date?: string;
    certificate_image?: File | null;
  }[];
  educations?: {
    degree: string;
    institution_name: string;
    country?: string;
    city?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
  }[];
  bio?: string;
  teaching_style?: string;
  expectation?: string;
  description?: string;
  intro_video_url?: string;
  intro_video_file?: File | null;
}

export interface Enrollment {
  id: number;
  student: number;
  course: Course;
  status: 'draft' | 'pending_payment' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
  payment_amount: string;
  currency: string;
  payment_note: string;
  payment_proof: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface CreateEnrollmentInput {
  course: number;
  payment_amount: number;
  currency: string;
  payment_note?: string;
  payment_proof: File;
}
