'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Empty, Spin, List, Tag } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { studentApi } from '../studentApi';

export default function HomeworksTab() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: studentApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  const homeworks = dashboardData?.student?.student_homework_sent || [];
  const completedHomeworks = dashboardData?.student?.student_homework_completed || [];

  if (homeworks.length === 0 && completedHomeworks.length === 0) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <Empty
          description="هیچ تکلیفی ثبت نشده است"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-0 shadow-sm" title="تکالیف ارسال شده">
        {homeworks.length === 0 ? (
          <Empty description="تکلیفی ارسال نشده است" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            dataSource={homeworks}
            renderItem={(item: any, index: number) => (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={<FileTextOutlined className="text-2xl text-purple-500" />}
                  title={<span className="font-medium">تکلیف {index + 1}</span>}
                  description={
                    <div className="flex items-center gap-2 mt-1">
                      <Tag color="blue" icon={<ClockCircleOutlined />} className="rounded-full">
                        در حال بررسی
                      </Tag>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card className="rounded-2xl border-0 shadow-sm" title="تکالیف تکمیل شده">
        {completedHomeworks.length === 0 ? (
          <Empty description="تکلیف تکمیل شده‌ای وجود ندارد" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            dataSource={completedHomeworks}
            renderItem={(item: any, index: number) => (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={<FileTextOutlined className="text-2xl text-green-500" />}
                  title={<span className="font-medium">تکلیف {index + 1}</span>}
                  description={
                    <div className="flex items-center gap-2 mt-1">
                      <Tag color="green" icon={<CheckCircleOutlined />} className="rounded-full">
                        تکمیل شده
                      </Tag>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
