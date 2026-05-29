export interface Student {
  id: number;
  user: number;
  courses_list: number[];
  favourite_tutors: number[];
  student_active: boolean;
  student_homework_completed: any[];
  messages_received: any[];
  messages_sent: any[];
  reviews: any[];
  student_homework_sent: any[];
}

export interface StudentDashboardData {
  student: Student;
  enrollments: Enrollment[];
  approved_courses: Course[];
}

export interface Enrollment {
  id: number;
  student: number;
  course: Course;
  status: 'draft' | 'pending_payment' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
  payment_amount: string | null;
  currency: string;
  payment_note: string;
  payment_proof: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string | null;
  tutor: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  };
  level: string;
  language: string;
  price_per_toman: string;
}

export interface StudentProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  bio?: string;
  profile_picture?: File | null;
}
