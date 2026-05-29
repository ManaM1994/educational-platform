"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Skeleton,
  Empty,
  Select,
  Input,
  Form,
  Modal,
  InputNumber,
  Upload,
  Button,
  message,
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/features/courses/api/coursesApi";
import CourseCard from "@/features/courses/components/CourseCard";
import CourseDetailModal from "@/features/courses/components/CourseDetailModal";
import Navbar from "@/src/components/Navbar";
import { Course } from "@/types";
import { useAuth } from "@/features/auth/useAuth";
import { Card } from "antd";
import { formatPrice } from "@/utils/currency";
import { useAppSelector } from "@/src/store/hooks";

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

export default function CoursesPage() {
  const theme = useAppSelector((state) => state.theme.mode);
  const [filters, setFilters] = useState({
    language: undefined,
    level: undefined,
    search: "",
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => coursesApi.getAllCourses(filters),
  });

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
    <>
      <Navbar />
      <div className="min-h-screen bg-surface py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-forground mb-3">
              تمام دوره‌ها
            </h1>
            <p className="text-muted text-lg">
              دوره‌های آموزشی زبان را مرور کنید و در آن‌ها ثبت‌نام کنید
            </p>
          </div>

          <div className={`rounded-3xl shadow-sm p-6 mb-8 ${theme === 'dark' ? 'border border-[#1f4075]' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="جستجو در دوره‌ها..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                size="large"
                className="rounded-xl"
              />
              <Select
                placeholder="زبان"
                allowClear
                size="large"
                className="w-full"
                value={filters.language}
                onChange={(value) =>
                  setFilters({ ...filters, language: value })
                }
              >
                <Select.Option value="English">انگلیسی</Select.Option>
                <Select.Option value="French">فرانسوی</Select.Option>
                <Select.Option value="German">آلمانی</Select.Option>
                <Select.Option value="Spanish">اسپانیایی</Select.Option>
              </Select>
              <Select
                placeholder="سطح"
                allowClear
                size="large"
                className="w-full"
                value={filters.level}
                onChange={(value) => setFilters({ ...filters, level: value })}
              >
                <Select.Option value="Beginner">مبتدی</Select.Option>
                <Select.Option value="Intermediate">متوسط</Select.Option>
                <Select.Option value="Advanced">پیشرفته</Select.Option>
              </Select>
              <Button
                size="large"
                onClick={() =>
                  setFilters({
                    language: undefined,
                    level: undefined,
                    search: "",
                  })
                }
                className="rounded-xl"
              >
                پاک کردن فیلترها
              </Button>
            </div>
          </div>

          {isError ? (
            <Empty description="خطا در دریافت دوره‌ها" />
          ) : (
            <Row gutter={[24, 24]}>
              {isLoading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={8}>
                    <CourseCardSkeleton />
                  </Col>
                ))
              ) : courses.length === 0 ? (
                <Col span={24}>
                  <Empty description="دوره‌ای یافت نشد" />
                </Col>
              ) : (
                courses.map((course) => (
                  <Col key={course.id} xs={24} sm={12} lg={8}>
                    <CourseCard
                      course={course}
                      onCardClick={handleCardClick}
                      onEnrollClick={handleEnrollClick}
                      showPopularBadge={false}
                    />
                  </Col>
                ))
              )}
            </Row>
          )}

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
            <Form
              form={form}
              layout="vertical"
              onFinish={handleEnrollmentSubmit}
            >
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

              <Form.Item name="currency" label="واحد پول" initialValue="TOMAN">
                <Input disabled />
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
                  className="bg-purple-600"
                >
                  ارسال درخواست
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
}
