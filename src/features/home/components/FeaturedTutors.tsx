"use client";

import { Card, Row, Col, Tag, Avatar, Skeleton, Empty } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useFeaturedTutors } from "../hooks/useHomeData";
import { Tutor } from "@/types";

function TutorCard({ tutor }: { tutor: Tutor }) {
  const fullName =
    `${tutor.user.first_name} ${tutor.user.last_name}`.trim() ||
    tutor.user.email;

  return (
    <Card className="h-full rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 text-center border-0 group cursor-pointer overflow-hidden bg-card">
      <div className="absolute top-0 left-0 right-0 h-24 bg-[var(--primary)]"></div>

      <div className="flex flex-col items-center gap-4 py-4 relative">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-theme shadow-lg relative z-10">
            {tutor.profile_picture ? (
              <Image
                src={`${tutor.profile_picture}`}
                alt={fullName}
                fill
                className="object-cover"
              />
            ) : (
              <Avatar
                size={112}
                icon={<UserOutlined />}
                className="primary-gradient text-on-primary"
              />
            )}
          </div>
          {tutor.is_approved && (
            <div className="absolute w-6 h-6 bottom-0 right-0 bg-green-500 rounded-full border-none border-2 shadow-md flex justify-center items-center z-10">
              <CheckCircleOutlined className="text-white text-sm " />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-purple-600 transition-colors">
            {fullName}
          </h3>
          <p className="text-sm text-muted">{tutor.user.email}</p>
        </div>

        {tutor.bio && (
          <p className="text-sm text-muted line-clamp-2 text-center px-4 leading-relaxed">
            {tutor.bio}
          </p>
        )}

        {tutor.subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center px-4">
            {tutor.subjects.slice(0, 3).map((subject, i) => (
              <Tag
                key={i}
                color="purple"
                className="rounded-full px-3 py-1 border-0 font-medium text-xs"
              >
                {subject}
              </Tag>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 w-full px-4">
          {tutor.languages_spoken.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted bg-card rounded-xl py-2 px-3">
              <GlobalOutlined className="text-purple-500" />
              <span className="font-medium">
                {tutor.languages_spoken.map((l) => l.language).join("، ")}
              </span>
            </div>
          )}

          {tutor.country && (
            <div className="text-xs text-muted bg-card rounded-xl py-2 px-3">
              📍 {tutor.country}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function TutorCardSkeleton() {
  return (
    <Card className="h-full rounded-3xl text-center border-0">
      <div className="flex flex-col items-center gap-4 py-4">
        <Skeleton.Avatar active size={112} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    </Card>
  );
}

export default function FeaturedTutors() {
  const { data: tutors, isLoading, isError } = useFeaturedTutors();

  return (
    <section className="py-20 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <StarOutlined />
            اساتید برتر
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-3">
            اساتید برگزیده
          </h2>
          <p className="text-muted text-lg">
            با بهترین مدرسان زبان انگلیسی آشنا شوید
          </p>
        </div>

        {isError ? (
          <Empty description="خطا در دریافت لیست اساتید" />
        ) : (
          <Row gutter={[24, 24]}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={8}>
                    <TutorCardSkeleton />
                  </Col>
                ))
              : tutors?.map((tutor) => (
                  <Col key={tutor.id} xs={24} sm={12} lg={8}>
                    <TutorCard tutor={tutor} />
                  </Col>
                ))}
          </Row>
        )}
      </div>
    </section>
  );
}
