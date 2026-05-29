"use client";

import {
  Modal,
  Button,
  Tag,
  Divider,
  List,
  Avatar,
  Upload,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Course } from "@/types";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "../api/coursesApi";
import { useAuth } from "@/features/auth/useAuth";
import { formatPrice, formatPriceWithCurrency } from "@/utils/currency";

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

export default function CourseDetailModal({
  course,
  open,
  onClose,
}: CourseDetailModalProps) {
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: myEnrollments } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: coursesApi.getMyEnrollments,
  });
  const isAlreadyEnrolled = !!myEnrollments?.some(
    (enroll: any) => enroll.course.id === course?.id,
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
      onClose();
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.detail ||
        "خطا در ثبت‌نام. لطفا دوباره تلاش کنید.";
      message.error(errorMsg);
    },
  });

  if (!course) return null;

  const handleEnrollClick = () => {
    if (!user) {
      message.warning("لطفا ابتدا وارد حساب کاربری خود شوید.");
      return;
    }

    if (user.is_teacher) {
      message.warning("مدرسان نمی‌توانند در دوره‌ها ثبت‌نام کنند.");
      return;
    }
    if (isAlreadyEnrolled) {
      message.info("شما قبلاً در این دوره ثبت‌نام کرده‌اید.");
      return;
    }

    form.setFieldsValue({
      payment_amount: parseFloat(course.price_per_toman),
      currency: "TOMAN",
    });
    setEnrollmentModalOpen(true);
  };

  const handleEnrollmentSubmit = (values: any) => {
    if (!values.payment_proof || values.payment_proof.fileList.length === 0) {
      message.error("لطفا رسید پرداخت را آپلود کنید.");
      return;
    }
    if (isAlreadyEnrolled) {
      message.error("شما قبلا در این دوره ثبت نام کرده اید.");
      return;
    }

    const enrollmentData = {
      course: course.id,
      payment_amount: values.payment_amount,
      currency: values.currency,
      payment_note: values.payment_note || "",
      payment_proof: values.payment_proof.fileList[0].originFileObj,
    };

    enrollMutation.mutate(enrollmentData);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
        className="course-detail-modal"
        centered
      >
        <div className="space-y-6 p-3.5">
          {course.image && (
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-1.5">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag color="purple" className="rounded-full px-3 py-1">
                {course.language}
              </Tag>
              <Tag color="green" className="rounded-full px-3 py-1">
                {course.level}
              </Tag>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {course.title}
            </h2>
            <p className="text-muted">{course.description}</p>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-bold mb-3">جزئیات دوره</h3>
            <p className="text-muted leading-relaxed">{course.detail}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">پیش‌نیازها</h3>
            <p className="text-muted leading-relaxed">{course.requirements}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">مواد آموزشی</h3>
            <p className="text-muted leading-relaxed">{course.materials}</p>
          </div>

          <Divider />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-purple-600 text-lg" />
              <div>
                <p className="text-xs text-muted">روز برگزاری</p>
                <p className="font-semibold">{course.schedule_day}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-purple-600 text-lg" />
              <div>
                <p className="text-xs text-muted">ساعت برگزاری</p>
                <p className="font-semibold">
                  {course.schedule_start} - {course.schedule_end}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOutlined className="text-purple-600 text-lg" />
              <div>
                <p className="text-xs text-muted">مدت دوره</p>
                <p className="font-semibold">{course.course_duration} دقیقه</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TeamOutlined className="text-purple-600 text-lg" />
              <div>
                <p className="text-xs text-muted">ظرفیت</p>
                <p className="font-semibold">
                  {course.active_students} / {course.capacity}
                </p>
              </div>
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-bold mb-3">مدرس دوره</h3>
            <div className="flex items-center gap-3">
              <Avatar
                size={54}
                icon={<UserOutlined />}
                src={course.tutor.profile_picture}
              />
              <div>
                <p className="font-semibold text-lg">
                  {course.tutor.user.first_name} {course.tutor.user.last_name}
                </p>
                {course.tutor.subjects && course.tutor.subjects.length > 0 && (
                  <p className="text-sm text-muted">
                    {course.tutor.subjects.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {course.lessons && course.lessons.length > 0 && (
            <>
              <Divider />
              <div>
                <h3 className="text-lg font-bold mb-3">سرفصل‌های دوره</h3>
                <List
                  dataSource={course.lessons}
                  renderItem={(lesson, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={lesson.title}
                        description={lesson.description}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </>
          )}

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">هزینه دوره</p>
              <p className="text-xl font-bold text-purple-600">
                {formatPriceWithCurrency(course.price_per_toman)}
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              className="btn-primary px-8"
              onClick={handleEnrollClick}
              loading={enrollMutation.isPending}
            >
              ثبت‌نام در دوره
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="ثبت‌نام در دوره"
        open={enrollmentModalOpen}
        onCancel={() => {
          setEnrollmentModalOpen(false);
          form.resetFields();
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
          {isAlreadyEnrolled ? (
            <Button disabled size="large">
              شما قبلاً ثبت‌نام کرده‌اید
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEnrollmentModalOpen(false);
                  form.resetFields();
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
          )}
        </Form>
      </Modal>
    </>
  );
}
