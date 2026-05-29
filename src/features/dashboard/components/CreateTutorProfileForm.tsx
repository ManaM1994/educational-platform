"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Steps,
  Upload,
  Select,
  DatePicker,
  message,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { tutorApi } from "../api/tutorApi";
import type { UploadFile } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateTutorProfileForm({
  onSuccess,
  initialFirstName,
  initialLastName,
}: {
  onSuccess: () => void;
  initialFirstName?: string;
  initialLastName?: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [profilePicture, setProfilePicture] = useState<UploadFile | null>(null);
  const [introVideo, setIntroVideo] = useState<UploadFile | null>(null);

  const createProfileMutation = useMutation({
    mutationFn: tutorApi.createProfile,
    onSuccess: () => {
      message.success("پروفایل با موفقیت ثبت شد و در انتظار تأیید مدیر است.");
      onSuccess();
    },
    onError: () => {
      message.error("ثبت پروفایل ناموفق بود. لطفا دوباره تلاش کنید.");
    },
  });

  const steps = [
    { title: "اطلاعات پایه" },
    { title: "تصویر پروفایل" },
    { title: "گواهی نامه ها" },
    { title: "تحصیلات" },
    { title: "درباره من" },
    { title: "ویدئو معرفی" },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values: any) => {
    const certificates = (values.certificates || []).map(
      (certificate: any) => ({
        ...certificate,
        issue_date: certificate.issue_date
          ? certificate.issue_date.format("YYYY-MM-DD")
          : null,
      }),
    );
    const educations = (values.educations || []).map((education: any) => ({
      ...education,
      start_date: education.start_date
        ? education.start_date.format("YYYY-MM-DD")
        : null,
      end_date: education.end_date
        ? education.end_date.format("YYYY-MM-DD")
        : null,
    }));
    const formData: any = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      country: values.country,
      subjects: values.subjects || [],
      languages_spoken: values.languages_spoken || [],
      profile_picture: profilePicture?.originFileObj || null,
      certificates,
      educations,
      bio: values.bio,
      teaching_style: values.teaching_style,
      expectation: values.expectation,
      description: values.description,
      intro_video_url: values.intro_video_url,
      intro_video_file: introVideo?.originFileObj || null,
    };

    createProfileMutation.mutate(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Form.Item
              name="first_name"
              label="نام"
              rules={[{ required: true }]}
            >
              <Input placeholder="نام خود را وارد کنید" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="نام خانوادگی"
              rules={[{ required: true }]}
            >
              <Input placeholder="نام خانوادگی خود را وارد کنید" />
            </Form.Item>
            <Form.Item name="phone_number" label="شماره تلفن">
              <Input placeholder="شماره تلفن خود را وارد کنید" />
            </Form.Item>
            <Form.Item name="country" label="کشور">
              <Input placeholder="کشور محل زندگی" />
            </Form.Item>
            <Form.Item
              name="subjects"
              label=" دروس"
              rules={[{ required: true }]}
            >
              <Select mode="tags" placeholder="دروسی که تدریس میکنید وارد کنید">
                <Option value="English">انگلیسی</Option>
                <Option value="Math">فرانسوی</Option>
                <Option value="Science">عربی</Option>
              </Select>
            </Form.Item>
            <Form.List name="languages_spoken">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key} className="flex gap-2 items-start">
                      <Form.Item
                        {...field}
                        name={[field.name, "language"]}
                        label="زبان"
                        className="flex-1"
                      >
                        <Input placeholder="مثال: انگلیسی" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "level"]}
                        label="سطح"
                        className="flex-1"
                      >
                        <Select placeholder="انتخاب سطح">
                          <Option value="A1">A1</Option>
                          <Option value="A2">A2</Option>
                          <Option value="B1">B1</Option>
                          <Option value="B2">B2</Option>
                          <Option value="C1">C1</Option>
                          <Option value="C2">C2</Option>
                          <Option value="Native">Native</Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(field.name)}
                        className="mt-10"
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    افزودن زبان
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Form.Item label="تصویر پروفایل">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={({ fileList }) =>
                  setProfilePicture(fileList[0] || null)
                }
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>آپلود</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Form.List name="certificates">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="border p-4 rounded-lg space-y-2 relative"
                    >
                      <MinusCircleOutlined
                        onClick={() => remove(field.name)}
                        className="absolute top-2 right-2 text-red-500 cursor-pointer"
                      />
                      <Form.Item
                        {...field}
                        name={[field.name, "title"]}
                        label="عنوان گواهی"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="مثال: گواهی TEFL" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "issued_by"]}
                        label="صادر کننده"
                      >
                        <Input placeholder="مثلا مجتمع فنی و ..." />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "issue_date"]}
                        label="تاریخ صدور"
                      >
                        <DatePicker className="w-full" />
                      </Form.Item>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                  >
                    افزودن گواهی
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Form.List name="educations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="border p-4 rounded-lg space-y-2 relative"
                    >
                      <MinusCircleOutlined
                        onClick={() => remove(field.name)}
                        className="absolute top-2 right-2 text-red-500 cursor-pointer"
                      />
                      <Form.Item
                        {...field}
                        name={[field.name, "degree"]}
                        label="مدرک"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="مثال: کارشناسی" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "institution_name"]}
                        label="نام مؤسسه"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="مثال: دانشگاه تهران" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "field"]}
                        label="رشته تحصیلی"
                      >
                        <Input placeholder="مثال: زبان و ادبیات انگلیسی" />
                      </Form.Item>
                      <div className="grid grid-cols-2 gap-2">
                        <Form.Item
                          {...field}
                          name={[field.name, "country"]}
                          label="کشور"
                        >
                          <Input placeholder="کشور" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "city"]}
                          label="شهر"
                        >
                          <Input placeholder="شهر" />
                        </Form.Item>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Form.Item
                          {...field}
                          name={[field.name, "start_date"]}
                          label="تاریخ شروع"
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "end_date"]}
                          label="تاریخ پایان"
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                  >
                    افزودن سابقه تحصیلی
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Form.Item name="bio" label="بیوگرافی">
              <TextArea rows={4} placeholder="درباره خودتان بنویسید" />
            </Form.Item>
            <Form.Item name="teaching_style" label="سبک تدریس">
              <TextArea rows={3} placeholder="سبک تدریس خود را توضیح دهید" />
            </Form.Item>
            <Form.Item name="expectation" label="انتظارات">
              <TextArea rows={3} placeholder="انتظارات شما از دانشجو چیست؟" />
            </Form.Item>
            <Form.Item name="description" label="توضیحات">
              <TextArea rows={4} placeholder="اطلاعات تکمیلی" />
            </Form.Item>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Form.Item name="intro_video_url" label="آدرس ویدئوی معرفی">
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>
            <Form.Item label="یا فایل ویدئوی معرفی را آپلود کنید">
              <Upload
                maxCount={1}
                beforeUpload={() => false}
                onChange={({ fileList }) => setIntroVideo(fileList[0] || null)}
              >
                <Button icon={<UploadOutlined />}>آپلود ویدئو</Button>
              </Upload>
            </Form.Item>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-card rounded-3xl shadow-sm p-8 border-theme">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          لطفا اطلاعات پروفایل خود را تکمیل نمایید
        </h2>

        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: "24px" }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            first_name: initialFirstName || "",
            last_name: initialLastName || "",
          }}
        >
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && <Button onClick={prev}>مرحله قبل</Button>}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next} className=" btn-primary">
                مرحله بعد
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                loading={createProfileMutation.isPending}
                className=" btn-primary"
              >
                ثبت اطلاعات پروفایل
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
