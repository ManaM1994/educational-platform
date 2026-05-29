"use client";

import { Card, Row, Col, Statistic, List, Rate, Avatar } from "antd";
import {
  UserOutlined,
  BookOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { TutorDashboardData, Review } from "@/types";

interface TutorDashboardTabProps {
  dashboardData: TutorDashboardData;
  reviews: Review[];
}

export default function TutorDashboardTab({
  dashboardData,
  reviews,
}: TutorDashboardTabProps) {
  const totalStudents = dashboardData.enrollments?.length || 0;
  const activeCourses = dashboardData.tutor?.courses?.length || 0;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="تعداد کل دانشجویان"
              value={totalStudents}
              prefix={<TeamOutlined className="text-purple-600" />}
              valueStyle={{ color: "#7C3AED" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="دوره‌های فعال"
              value={activeCourses}
              prefix={<BookOutlined className="text-purple-600" />}
              valueStyle={{ color: "#7C3AED" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="میانگین امتیاز"
              value={averageRating.toFixed(1)}
              prefix={<StarOutlined className="text-purple-600" />}
              valueStyle={{ color: "#7C3AED" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="تعداد کل بازخوردها"
              value={reviews.length}
              prefix={<UserOutlined className="text-purple-600" />}
              valueStyle={{ color: "#7C3AED" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="بازخوردهای اخیر" className="rounded-2xl shadow-sm">
        <List
          itemLayout="horizontal"
          dataSource={reviews.slice(0, 5)}
          locale={{ emptyText: "هنوز بازخوردی ثبت نشده است" }}
          renderItem={(review) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <div className="flex items-center gap-2">
                    <span>
                      {review.student.user.first_name}{" "}
                      {review.student.user.last_name}
                    </span>
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      className="text-sm"
                    />
                  </div>
                }
                description={
                  <div>
                    <p className="text-foreground">{review.review_text}</p>
                    <p className="text-muted text-xs mt-1">
                      {review.review_date}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
