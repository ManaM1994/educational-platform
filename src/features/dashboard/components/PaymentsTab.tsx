"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Table, Tag, Empty, Spin } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { studentApi } from "../studentApi";
import { Enrollment } from "@/types/student";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  draft: { label: "پیش‌نویس", color: "default", icon: <ClockCircleOutlined /> },
  pending_payment: {
    label: "در انتظار پرداخت",
    color: "orange",
    icon: <ClockCircleOutlined />,
  },
  under_review: {
    label: "در حال بررسی",
    color: "blue",
    icon: <ClockCircleOutlined />,
  },
  approved: {
    label: "تایید شده",
    color: "green",
    icon: <CheckCircleOutlined />,
  },
  rejected: { label: "رد شده", color: "red", icon: <CloseCircleOutlined /> },
  cancelled: {
    label: "لغو شده",
    color: "default",
    icon: <CloseCircleOutlined />,
  },
};

export default function PaymentsTab() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: studentApi.getDashboard,
  });

  const columns: ColumnsType<Enrollment> = [
    {
      title: "دوره",
      dataIndex: ["course", "title"],
      key: "course",
      render: (title: string) => <span className="font-medium">{title}</span>,
    },
    {
      title: "مبلغ",
      dataIndex: "payment_amount",
      key: "amount",
      render: (amount: string | null) => (
        <span className="font-bold text-purple-600">
          {amount ? `${Number(amount).toLocaleString("fa-IR")} تومان` : "-"}
        </span>
      ),
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status] || statusConfig.draft;
        return (
          <Tag color={config.color} icon={config.icon} className="rounded-full">
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "تاریخ ثبت",
      dataIndex: "submitted_at",
      key: "date",
      render: (date: string) => (
        <span className="text-sm text-muted">
          {new Date(date).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  const enrollments = dashboardData?.enrollments || [];

  if (enrollments.length === 0) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <Empty
          description="هیچ پرداختی ثبت نشده است"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <Table
        columns={columns}
        dataSource={enrollments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
