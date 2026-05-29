"use client";

import { useState } from "react";
import { Spin, Tabs, Alert } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tutorApi } from "@/features/dashboard/api/tutorApi";
import { useAuth } from "@/features/auth/useAuth";
import CreateTutorProfileForm from "@/features/dashboard/components/CreateTutorProfileForm";
import TutorProfileTab from "@/features/dashboard/components/tutor/TutorProfileTab";
import TutorDashboardTab from "@/features/dashboard/components/tutor/TutorDashboardTab";
import TutorCoursesTab from "@/features/dashboard/components/tutor/TutorCoursesTab";
import TutorReviewsTab from "@/features/dashboard/components/tutor/TutorReviewsTab";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAppSelector } from "@/src/store/hooks";

export default function TutorDashboardPage() {
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const theme = useAppSelector((state) => state.theme.mode);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileSubmitted, setProfileSubmitted] = useState(false);

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch,
  } = useQuery({
    queryKey: ["tutorDashboard"],
    queryFn: tutorApi.getMyDashboard,
    enabled:
      !!user &&
      user.is_teacher === true &&
      (user.has_tutor_profile === true || profileSubmitted),
    retry: false,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["tutorReviews", dashboardData?.tutor?.id],
    queryFn: () => tutorApi.getReviews(dashboardData!.tutor.id),
    enabled: !!dashboardData?.tutor?.id,
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "dashboard") {
      refetch();
    }
  };

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (
    !dashboardData?.tutor &&
    user?.has_tutor_profile === false &&
    !profileSubmitted
  ) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <CreateTutorProfileForm
          initialFirstName={user?.first_name}
          initialLastName={user?.last_name}
          onSuccess={() => {
            setProfileSubmitted(true);
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            refetch();
          }}
        />
      </div>
    );
  }

  if (!dashboardData?.tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: "dashboard",
      label: "داشبورد من",
      disabled: !dashboardData.tutor.is_approved,
      children: (
        <TutorDashboardTab dashboardData={dashboardData} reviews={reviews} />
      ),
    },
    {
      key: "profile",
      label: "پروفایل",
      disabled: !dashboardData.tutor.is_approved,
      children: <TutorProfileTab tutor={dashboardData.tutor} />,
    },
    {
      key: "courses",
      label: "مدیریت دوره‌ها",
      disabled: !dashboardData.tutor.is_approved,
      children: <TutorCoursesTab tutorId={dashboardData.tutor.id} />,
    },
    {
      key: "reviews",
      label: "مشاهده بازخوردها",
      disabled: !dashboardData.tutor.is_approved,
      children: <TutorReviewsTab reviews={reviews} />,
    },
  ];

  return (
    <ProtectedRoute requireTeacher>
      <Navbar />
      <div className="min-h-screen bg-surface">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forground">داشبورد مدرس</h1>
            <p className="text-muted mt-2">
              {dashboardData.tutor.user.first_name} عزیز، خوش آمدید.
            </p>
            {!dashboardData.tutor.is_approved && (
              <div className="mt-4">
                <Alert
                  message="در انتظار تأیید مدیر"
                  description="پروفایل شما ثبت شده و در حال بررسی است. در این مدت می‌توانید داشبورد خود را مشاهده کنید."
                  type="info"
                  showIcon
                  className="rounded-2xl"
                />
              </div>
            )}
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            tabPosition="right"
            className="tutor-dashboard-tabs"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
