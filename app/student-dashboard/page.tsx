'use client';

import { useState } from 'react';
import { Tabs, Spin } from 'antd';
import { UserOutlined, BookOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/features/auth/useAuth';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import ProfileTab from '@/features/dashboard/components/ProfileTab';
import CoursesTab from '@/features/dashboard/components/CoursesTab';
import PaymentsTab from '@/features/dashboard/components/PaymentsTab';
import HomeworksTab from '@/features/dashboard/components/HomeworksTab';

export default function StudentDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          پروفایل
        </span>
      ),
      children: <ProfileTab />,
    },
    {
      key: 'courses',
      label: (
        <span className="flex items-center gap-2">
          <BookOutlined />
          دوره‌های من
        </span>
      ),
      children: <CoursesTab />,
    },
    {
      key: 'payments',
      label: (
        <span className="flex items-center gap-2">
          <DollarOutlined />
          پرداخت‌ها
        </span>
      ),
      children: <PaymentsTab />,
    },
    {
      key: 'homeworks',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          تکالیف
        </span>
      ),
      children: <HomeworksTab />,
    },
  ];

  return (
    <ProtectedRoute requireStudent>
      <Navbar />
      <main className="min-h-screen bg-surface py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-forground">
              داشبورد دانشجو
            </h1>
            <p className="text-muted mt-1">
              خوش آمدید {user?.first_name} {user?.last_name}
            </p>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            tabPosition="right"
            className="dashboard-tabs"
          />
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
