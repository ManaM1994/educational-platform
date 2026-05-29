"use client";

import { useState } from "react";
import { Form, Input, Button, Upload, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tutorApi } from "../../api/tutorApi";
import type { UploadFile } from "antd";
import type { Tutor } from "@/types";

const { TextArea } = Input;
const { Option } = Select;

export default function TutorProfileTab({ tutor }: { tutor: Tutor }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [profilePicture, setProfilePicture] = useState<UploadFile | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<Tutor>) =>
      tutorApi.updateProfile(tutor.id, profileData),
    onSuccess: () => {
      message.success("پروفایل با موفقیت به‌روزرسانی شد.");
      queryClient.invalidateQueries({ queryKey: ["tutorDashboard"] });
    },
    onError: () => {
      message.error("به‌روزرسانی پروفایل ناموفق بود.");
    },
  });

  const onFinish = (values: any) => {
    const updateData: any = {
      user_first_name: values.first_name,
      user_last_name: values.last_name,
      phone_number: values.phone_number,
      country: values.country,
      subjects: values.subjects,
      languages_spoken: values.languages_spoken,
      bio: values.bio,
      teaching_style: values.teaching_style,
      expectation: values.expectation,
      description: values.description,
    };

    if (profilePicture?.originFileObj) {
      updateData.profile_picture = profilePicture.originFileObj;
    }

    updateProfileMutation.mutate(updateData);
  };

  return (
    <div className="bg-card rounded-2xl p-6 border-theme">
      <h3 className="text-xl font-semibold text-foreground mb-6">
        ویرایش پروفایل
      </h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          first_name: tutor.user.first_name,
          last_name: tutor.user.last_name,
          phone_number: tutor.phone_number,
          country: tutor.country,
          subjects: tutor.subjects,
          languages_spoken: tutor.languages_spoken,
          bio: tutor.bio,
          teaching_style: tutor.teaching_style,
          expectation: tutor.expectation,
          description: tutor.description,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="first_name" label="نام" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="نام خانوادگی"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="phone_number" label="شماره تلفن">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="کشور">
            <Input />
          </Form.Item>
        </div>

        <Form.Item name="subjects" label="دروس" rules={[{ required: true }]}>
          <Select mode="tags" placeholder="دروس را اضافه کنید">
            <Option value="English">انگلیسی</Option>
            <Option value="Math">ریاضی</Option>
            <Option value="Science">علوم</Option>
          </Select>
        </Form.Item>

        <Form.Item label="تصویر پروفایل">
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => setProfilePicture(fileList[0] || null)}
            defaultFileList={
              tutor.profile_picture
                ? [
                    {
                      uid: "-1",
                      name: "profile.jpg",
                      status: "done",
                      url: tutor.profile_picture,
                    },
                  ]
                : []
            }
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>آپلود</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="bio" label="بیوگرافی">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="teaching_style" label="سبک تدریس">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="expectation" label="انتظارات">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="description" label="توضیحات">
          <TextArea rows={4} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={updateProfileMutation.isPending}
          className="btn-primary"
        >
          ذخیره تغییرات
        </Button>
      </Form>
    </div>
  );
}
