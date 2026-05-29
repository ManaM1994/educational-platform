"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Row, Col, Tag, Empty, Spin, Progress } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { studentApi } from "../studentApi";

export default function CoursesTab() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: studentApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  const approvedCourses = dashboardData?.approved_courses || [];

  if (approvedCourses.length === 0) {
    return (
      <Card className="rounded-2xl border-theme bg-card shadow-sm">
        <Empty
          description="شما هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Row gutter={[16, 16]}>
        {approvedCourses.map((course) => (
          <Col key={course.id} xs={24} lg={12}>
            <Card className="rounded-2xl border-theme bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-card border-theme">
                  {course.image ? (
                    <Image
                      src={`http://localhost:8000${course.image}`}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-gradient">
                      <BookOutlined className="text-3xl text-on-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground mb-2 line-clamp-1">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted mb-2">
                    <UserOutlined className="text-purple-500" />
                    <span>
                      {course.tutor.user.first_name}{" "}
                      {course.tutor.user.last_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Tag color="purple" className="rounded-full">
                      {course.language}
                    </Tag>
                    <Tag color="green" className="rounded-full">
                      {course.level}
                    </Tag>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted">
                      <span>پیشرفت دوره</span>
                      <span>0%</span>
                    </div>
                    <Progress percent={0} strokeColor="#7C3AED" />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
