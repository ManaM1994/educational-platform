"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Form, Input, Button, Avatar, Upload, message, Spin } from "antd";
import { UserOutlined, CameraOutlined, SaveOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { studentApi } from "../studentApi";
import { useAuth } from "@/features/auth/useAuth";

export default function ProfileTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["student", "me"],
    queryFn: studentApi.getMe,
  });

  useEffect(() => {
    if (profileData) {
      form.setFieldsValue({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        phone_number: profileData.phone_number || "",
        bio: profileData.bio || "",
      });
    }
  }, [profileData, form]);

  const updateMutation = useMutation({
    mutationFn: studentApi.updateProfile,
    onSuccess: () => {
      message.success("پروفایل با موفقیت به‌روزرسانی شد");
      queryClient.invalidateQueries({ queryKey: ["student", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: () => {
      message.error("خطا در به‌روزرسانی پروفایل");
    },
  });

  const handleSubmit = (values: any) => {
    const data: any = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      bio: values.bio,
    };

    if (fileList.length > 0 && fileList[0].originFileObj) {
      data.profile_picture = fileList[0].originFileObj;
    }

    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-theme bg-card shadow-sm">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={
              profileData?.profile_picture
                ? `http://localhost:8000${profileData.profile_picture}`
                : undefined
            }
            className="border-4 border-theme bg-card text-foreground"
          />
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            maxCount={1}
            showUploadList={false}
          >
            <Button
              icon={<CameraOutlined />}
              shape="circle"
              className="absolute bottom-0 right-0 btn-primary border-0 hover:opacity-90"
            />
          </Upload>
        </div>
        <h3 className="text-xl font-bold text-foreground mt-4">
          {user?.first_name} {user?.last_name}
        </h3>
        <p className="text-muted">{user?.email}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          first_name: profileData?.first_name || "",
          last_name: profileData?.last_name || "",
          phone_number: profileData?.phone_number || "",
          bio: profileData?.bio || "",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="نام"
            name="first_name"
            rules={[{ required: true, message: "نام الزامی است" }]}
          >
            <Input size="large" placeholder="نام" className="rounded-xl" />
          </Form.Item>

          <Form.Item
            label="نام خانوادگی"
            name="last_name"
            rules={[{ required: true, message: "نام خانوادگی الزامی است" }]}
          >
            <Input
              size="large"
              placeholder="نام خانوادگی"
              className="rounded-xl"
            />
          </Form.Item>
        </div>

        <Form.Item label="شماره تماس" name="phone_number">
          <Input size="large" placeholder="شماره تماس" className="rounded-xl" />
        </Form.Item>

        <Form.Item label="درباره من" name="bio">
          <Input.TextArea
            rows={4}
            placeholder="درباره خودتان بنویسید..."
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={updateMutation.isPending}
            className="w-full md:w-auto rounded-xl btn-primary"
          >
            ذخیره تغییرات
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
