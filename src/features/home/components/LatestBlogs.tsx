"use client";

import { Card, Row, Col, Tag, Skeleton, Empty } from "antd";
import {
  CalendarOutlined,
  ReadOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useLatestBlogs } from "../hooks/useHomeData";
import { BlogPost } from "@/types";

const difficultyColors: Record<string, string> = {
  beginner: "green",
  Easy: "green",
  intermediate: "blue",
  Intermediate: "blue",
  advanced: "red",
  Advanced: "red",
};

const difficultyLabels: Record<string, string> = {
  beginner: "مبتدی",
  Easy: "مبتدی",
  intermediate: "متوسط",
  Intermediate: "متوسط",
  advanced: "پیشرفته",
  Advanced: "پیشرفته",
};

function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.id}`} className="block h-full">
      <Card
        className="h-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-theme bg-card group"
        cover={
          <div className="relative h-56 bg-linear-to-br from-indigo-100 to-purple-100 overflow-hidden">
            {post.picture ? (
              <Image
                src={post.picture}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200">
                <ReadOutlined className="text-6xl text-indigo-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        }
        styles={{ body: { padding: "20px" } }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {post.difficulty_level && (
              <Tag
                color={difficultyColors[post.difficulty_level] ?? "default"}
                className="rounded-full px-3 py-1 border-0 font-medium"
              >
                {difficultyLabels[post.difficulty_level] ??
                  post.difficulty_level}
              </Tag>
            )}
            {post.featured && (
              <Tag
                color="gold"
                className="rounded-full px-3 py-1 border-0 font-medium"
              >
                ⭐ ویژه
              </Tag>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-muted line-clamp-3 leading-relaxed">
            {post.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted mt-2 pt-3 border-t border-theme">
            <CalendarOutlined className="text-purple-500" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function BlogCardSkeleton() {
  return (
    <Card
      className="h-full rounded-3xl overflow-hidden border-0"
      styles={{ body: { padding: "20px" } }}
    >
      <Skeleton.Image active style={{ width: "100%", height: 224 }} />
      <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
    </Card>
  );
}

export default function LatestBlogs() {
  const { data: posts, isLoading, isError } = useLatestBlogs();

  return (
    <section className="py-20 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#445fff30] text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <BookOutlined />
            مقالات آموزشی
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-3">
            آخرین مقالات
          </h2>
          <p className="text-muted text-lg">
            جدیدترین مطالب آموزشی زبان انگلیسی
          </p>
        </div>

        {isError ? (
          <Empty description="خطا در دریافت مقالات" />
        ) : (
          <Row gutter={[24, 24]}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={8}>
                    <BlogCardSkeleton />
                  </Col>
                ))
              : posts?.map((post) => (
                  <Col key={post.id} xs={24} sm={12} lg={8}>
                    <BlogCard post={post} />
                  </Col>
                ))}
          </Row>
        )}
      </div>
    </section>
  );
}
