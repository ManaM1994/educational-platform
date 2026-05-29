'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useAuth } from '@/features/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTeacher?: boolean;
  requireStudent?: boolean;
}

export default function ProtectedRoute({ children, requireTeacher, requireStudent }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        return;
      }

      if (requireTeacher && !user.is_teacher) {
        router.push('/student-dashboard');
        return;
      }

      if (requireStudent && user.is_teacher) {
        router.push('/tutor-dashboard');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requireTeacher, requireStudent, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requireTeacher && !user.is_teacher) {
    return null;
  }

  if (requireStudent && user.is_teacher) {
    return null;
  }

  return <>{children}</>;
}
