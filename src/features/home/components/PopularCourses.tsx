"use client";

import {
  Row,
  Col,
  Skeleton,
  Empty,
  Form,
  Modal,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
} from "antd";
import {
  FireOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { usePopularCourses } from "../hooks/useHomeData";
import { Course } from "@/types";
import { useState } from "react";
import CourseCard from "@/features/courses/components/CourseCard";
import CourseDetailModal from "@/features/courses/components/CourseDetailModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/features/courses/api/coursesApi";
import { useAuth } from "@/features/auth/useAuth";
import { Card } from "antd";
import { formatPrice } from "@/utils/currency";
import Link from "next/link";

function CourseCardSkeleton() {
  return (
    <Card
      className="h-full rounded-3xl overflow-hidden border-0"
      styles={{ body: { padding: "20px" } }}
    >
      <Skeleton.Image
        className="w-full"
        active
        style={{ width: "250px", height: 208 }}
      />
      <Skeleton active paragraph={{ rows: 4 }} className="mt-4" />
    </Card>
  );
}

export default function PopularCourses() {
  const { data: courses, isLoading, isError } = usePopularCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: myEnrollments } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: coursesApi.getMyEnrollments,
  });
  const isAlreadyEnrolled = !!myEnrollments?.some(
    (enroll: any) => enroll.course.id === selectedCourse?.id,
  );

  const enrollMutation = useMutation({
    mutationFn: coursesApi.createEnrollment,
    onSuccess: () => {
      message.success(
        "درخواست ثبت‌نام شما با موفقیت ارسال شد و در انتظار بررسی است.",
      );
      queryClient.invalidateQueries({ queryKey: ["myEnrollments"] });
      setEnrollmentModalOpen(false);
      form.resetFields();
      setSelectedCourse(null);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.detail ||
        "خطا در ثبت‌نام. لطفا دوباره تلاش کنید.";
      message.error(errorMsg);
    },
  });

  const handleCardClick = (course: Course) => {
    setSelectedCourse(course);
    setDetailModalOpen(true);
  };

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    form.setFieldsValue({
      payment_amount: parseFloat(course.price_per_toman),
      currency: "TOMAN",
    });
    setEnrollmentModalOpen(true);
  };

  const handleEnrollmentSubmit = (values: any) => {
    if (isAlreadyEnrolled) {
      message.info("شما قبلاً در این دوره ثبت‌نام کرده‌اید.");
      return;
    }
    if (!selectedCourse) return;

    if (!values.payment_proof || values.payment_proof.fileList.length === 0) {
      message.error("لطفا رسید پرداخت را آپلود کنید.");
      return;
    }

    const enrollmentData = {
      course: selectedCourse.id,
      payment_amount: values.payment_amount,
      currency: values.currency,
      payment_note: values.payment_note || "",
      payment_proof: values.payment_proof.fileList[0].originFileObj,
    };

    enrollMutation.mutate(enrollmentData);
  };

  return (
    <section className="py-20 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#dcb7f63b] text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FireOutlined />
            دوره‌های پرطرفدار
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-3">
            دوره‌های محبوب
          </h2>
          <p className="text-muted text-lg">
            پرطرفدارترین دوره‌های زبان انگلیسی
          </p>
        </div>

        {isError ? (
          <Empty description="خطا در دریافت دوره‌ها" />
        ) : (
          <Row gutter={[24, 24]}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={8}>
                    <CourseCardSkeleton />
                  </Col>
                ))
              : courses?.map((course) => (
                  <Col key={course.id} xs={24} sm={12} lg={8}>
                    <CourseCard
                      course={course}
                      onCardClick={handleCardClick}
                      onEnrollClick={handleEnrollClick}
                      showPopularBadge={true}
                    />
                  </Col>
                ))}
          </Row>
        )}

        <div className="text-center mt-12">
          <Link href="/courses">
            <Button
              type="primary"
              size="large"
              className="btn-primary px-8 py-6 h-auto text-lg rounded-2xl"
              icon={<ArrowLeftOutlined />}
            >
              مشاهده تمام دوره‌ها
            </Button>
          </Link>
        </div>

        <CourseDetailModal
          course={selectedCourse}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedCourse(null);
          }}
        />

        <Modal
          title="ثبت‌نام در دوره"
          open={enrollmentModalOpen}
          onCancel={() => {
            setEnrollmentModalOpen(false);
            form.resetFields();
            setSelectedCourse(null);
          }}
          footer={null}
          width={500}
        >
          <Form form={form} layout="vertical" onFinish={handleEnrollmentSubmit}>
            <Form.Item
              name="payment_amount"
              label="مبلغ پرداختی"
              rules={[{ required: true, message: "لطفا مبلغ را وارد کنید" }]}
            >
              <InputNumber
                className="w-full"
                min={0}
                suffix="تومان"
                disabled
                formatter={(value) => formatPrice(value)}
              />
            </Form.Item>

            <Form.Item name="payment_note" label="یادداشت (اختیاری)">
              <Input.TextArea
                rows={3}
                placeholder="توضیحات اضافی در مورد پرداخت..."
              />
            </Form.Item>

            <Form.Item
              name="payment_proof"
              label="رسید پرداخت"
              rules={[
                { required: true, message: "لطفا رسید پرداخت را آپلود کنید" },
              ]}
            >
              <Upload
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>آپلود رسید پرداخت</Button>
              </Upload>
            </Form.Item>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEnrollmentModalOpen(false);
                  form.resetFields();
                  setSelectedCourse(null);
                }}
              >
                انصراف
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={enrollMutation.isPending}
                className="btn-primary"
              >
                ارسال درخواست
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </section>
  );
}
