"use client";

import { Card, Tag, Button, message } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  BookOutlined,
  FireOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Course } from "@/types";
import { useState } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { formatPriceWithCurrency } from "@/utils/currency";

interface CourseCardProps {
  course: Course;
  onEnrollClick: (course: Course) => void;
  onCardClick: (course: Course) => void;
  showPopularBadge?: boolean;
}

export default function CourseCard({
  course,
  onEnrollClick,
  onCardClick,
  showPopularBadge = false,
}: CourseCardProps) {
  const { user } = useAuth();

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      message.warning("لطفا ابتدا وارد حساب کاربری خود شوید.");
      return;
    }

    if (user.is_teacher) {
      message.warning("مدرسان نمی‌توانند در دوره‌ها ثبت‌نام کنند.");
      return;
    }

    onEnrollClick(course);
  };

  return (
    <Card
      className="h-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-0 group cursor-pointer bg-card"
      onClick={() => onCardClick(course)}
      cover={
        <div className="relative h-52 bg-primary-gradient overflow-hidden">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title || "Course Image"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-gradient">
              <BookOutlined className="text-6xl text-on-primary" />
            </div>
          )}
         
          {showPopularBadge && (
            <div className="absolute top-4 left-4">
              <div className="bg-linear-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <FireOutlined />
                محبوب
              </div>
            </div>
          )}
        </div>
      }
      styles={{ body: { padding: "20px" } }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag
            color="purple"
            className="rounded-full px-3 py-1 border-0 font-medium"
          >
            {course.language}
          </Tag>
          <Tag
            color="green"
            className="rounded-full px-3 py-1 border-0 font-medium"
          >
            {course.level}
          </Tag>
        </div>

        <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-muted line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted mt-1">
          <UserOutlined className="text-purple-500" />
          <span className="font-medium">
            {course.tutor.user.first_name} {course.tutor.user.last_name}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <ClockCircleOutlined />
            {course.course_duration} دقیقه
          </span>
          <span className="flex items-center gap-1">
            <UserOutlined />
            {course.active_students} دانشجو
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-theme">
          <div className="flex flex-col">
            <span className="text-purple-600 font-bold text-lg">
              {formatPriceWithCurrency(course.price_per_toman)}
            </span>
          </div>
          <Button
            type="primary"
            className="btn-primary"
            onClick={handleEnrollClick}
          >
            ثبت‌نام
          </Button>
        </div>
      </div>
    </Card>
  );
}
