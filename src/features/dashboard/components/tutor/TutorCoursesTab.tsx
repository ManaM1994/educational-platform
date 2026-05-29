"use client";

import { useState } from "react";
import {
  Button,
  Table,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tutorApi } from "../../api/tutorApi";
import type { TutorCourse } from "@/types";
import dayjs from "dayjs";
import { formatPrice, formatPriceWithCurrency } from "@/utils/currency";

const { TextArea } = Input;
const { Option } = Select;

export default function TutorCoursesTab({ tutorId }: { tutorId: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TutorCourse | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["tutorCourses", tutorId],
    queryFn: () => tutorApi.getTutorCourses(tutorId),
  });

  const createMutation = useMutation({
    mutationFn: tutorApi.createTutorCourse,
    onSuccess: () => {
      message.success("دوره با موفقیت ایجاد شد.");
      queryClient.invalidateQueries({ queryKey: ["tutorCourses"] });
      setDrawerOpen(false);
      form.resetFields();
    },
    onError: () => {
      message.error("ایجاد دوره ناموفق بود.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TutorCourse> }) =>
      tutorApi.updateTutorCourse(id, data),
    onSuccess: () => {
      message.success("دوره با موفقیت به‌روزرسانی شد.");
      queryClient.invalidateQueries({ queryKey: ["tutorCourses"] });
      setDrawerOpen(false);
      setEditingCourse(null);
      form.resetFields();
    },
    onError: () => {
      message.error("به‌روزرسانی دوره ناموفق بود.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tutorApi.deleteTutorCourse,
    onSuccess: () => {
      message.success("دوره با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: ["tutorCourses"] });
    },
    onError: () => {
      message.error("حذف دوره ناموفق بود.");
    },
  });

  const handleOpenDrawer = (course?: TutorCourse) => {
    if (course) {
      setEditingCourse(course);
      form.setFieldsValue({
        ...course,
        start_date: course.start_date ? dayjs(course.start_date) : null,
      });
    } else {
      setEditingCourse(null);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCourse(null);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    const courseData = {
      ...values,
      tutor: tutorId,
      start_date: values.start_date
        ? values.start_date.format("YYYY-MM-DD")
        : null,
      days_available: values.days_available || [],
      time_slots: values.time_slots || [],
    };

    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: courseData });
    } else {
      createMutation.mutate(courseData);
    }
  };

  const columns = [
    {
      title: "عنوان دوره",
      dataIndex: "course_title",
      key: "course_title",
    },
    {
      title: "نوع",
      dataIndex: "course_type",
      key: "course_type",
      render: (type: string) => <span className="capitalize">{type}</span>,
    },
    {
      title: "زبان",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "مدت‌زمان (دقیقه)",
      dataIndex: "duration_minutes",
      key: "duration_minutes",
    },
    {
      title: "هزینه هر ساعت",
      dataIndex: "price_per_hour",
      key: "price_per_hour",
      render: (price: string) => formatPriceWithCurrency(price),
    },
    {
      title: "تاریخ شروع",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: any, record: TutorCourse) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenDrawer(record)}
          />
          <Popconfirm
            title="حذف دوره"
            description="آیا از حذف این دوره مطمئن هستید؟"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 border-theme">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          مدیریت دوره‌ها
        </h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenDrawer()}
          className="btn-primary"
        >
          افزودن دوره
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title={editingCourse ? "ویرایش دوره" : "ایجاد دوره جدید"}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="course_title"
            label="عنوان دوره"
            rules={[
              { required: true, message: "لطفا عنوان دوره را وارد کنید" },
            ]}
          >
            <Input placeholder="مثال: مکالمه انگلیسی" />
          </Form.Item>

          <Form.Item
            name="course_type"
            label="نوع دوره"
            rules={[
              { required: true, message: "لطفا نوع دوره را انتخاب کنید" },
            ]}
          >
            <Select placeholder="نوع دوره را انتخاب کنید">
              <Option value="online">آنلاین</Option>
              <Option value="offline">حضوری</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="language"
            label="زبان"
            rules={[{ required: true, message: "لطفا زبان دوره را وارد کنید" }]}
          >
            <Input placeholder="مثال: انگلیسی" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="duration_minutes"
              label="مدت‌زمان (دقیقه)"
              rules={[
                { required: true, message: "لطفا مدت‌زمان را وارد کنید" },
              ]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="price_per_hour"
              label="هزینه هر ساعت (تومان)"
              rules={[{ required: true, message: "لطفا هزینه را وارد کنید" }]}
            >
              <InputNumber
                min={0}
                step={1000}
                className="w-full"
                formatter={(value) => formatPrice(value)}
                parser={(value) => value?.replace(/,/g, "") || ""}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="lesson_package"
            label="بسته جلسات"
            rules={[
              { required: true, message: "لطفا بسته جلسات را وارد کنید" },
            ]}
          >
            <Input placeholder="مثال: ۱۰ جلسه" />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="تاریخ شروع"
            rules={[
              { required: true, message: "لطفا تاریخ شروع را انتخاب کنید" },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="days_available" label="روزهای قابل ارائه">
            <Select mode="multiple" placeholder="روزها را انتخاب کنید">
              <Option value="Monday">دوشنبه</Option>
              <Option value="Tuesday">سه‌شنبه</Option>
              <Option value="Wednesday">چهارشنبه</Option>
              <Option value="Thursday">پنج‌شنبه</Option>
              <Option value="Friday">جمعه</Option>
              <Option value="Saturday">شنبه</Option>
              <Option value="Sunday">یکشنبه</Option>
            </Select>
          </Form.Item>

          <Form.Item name="time_slots" label="بازه‌های زمانی">
            <Select mode="tags" placeholder="مثال: ۸ تا ۱۰، ۱۰ تا ۱۲" />
          </Form.Item>

          <Form.Item
            name="description"
            label="توضیحات"
            rules={[{ required: true, message: "لطفا توضیحات را وارد کنید" }]}
          >
            <TextArea rows={4} placeholder="توضیحات دوره" />
          </Form.Item>

          <div className="flex gap-2">
            <Button onClick={handleCloseDrawer}>انصراف</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="btn-primary"
            >
              {editingCourse ? "به‌روزرسانی" : "ایجاد"}
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
