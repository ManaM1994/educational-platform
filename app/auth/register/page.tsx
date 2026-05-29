'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Radio, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, RegisterData } from '@/features/auth/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/features/auth/authSlice';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      is_teacher: false,
    },
  });

  const onSubmit = async (values: RegisterData) => {
    setLoading(true);
    try {
      const user = await authApi.register(values);
      dispatch(setUser(user));
      message.success('ثبت‌نام با موفقیت انجام شد');
      router.push('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.detail || 'خطا در ثبت‌نام';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-3xl border-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4">
            <BookOutlined className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ثبت‌نام</h1>
          <p className="text-gray-500">حساب کاربری جدید ایجاد کنید</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <Controller
              name="first_name"
              control={control}
              rules={{ required: 'نام الزامی است' }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="نام"
                  prefix={<UserOutlined className="text-gray-400" />}
                  status={errors.first_name ? 'error' : ''}
                  className="rounded-xl"
                />
              )}
            />
            {errors.first_name && (
              <span className="text-red-500 text-xs mt-1 block">{errors.first_name.message}</span>
            )}
          </div>

          <div>
            <Controller
              name="last_name"
              control={control}
              rules={{ required: 'نام خانوادگی الزامی است' }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="نام خانوادگی"
                  prefix={<UserOutlined className="text-gray-400" />}
                  status={errors.last_name ? 'error' : ''}
                  className="rounded-xl"
                />
              )}
            />
            {errors.last_name && (
              <span className="text-red-500 text-xs mt-1 block">{errors.last_name.message}</span>
            )}
          </div>

          <div>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'ایمیل الزامی است',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'فرمت ایمیل نامعتبر است',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  type="email"
                  placeholder="ایمیل"
                  prefix={<MailOutlined className="text-gray-400" />}
                  status={errors.email ? 'error' : ''}
                  className="rounded-xl"
                />
              )}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'رمز عبور الزامی است' }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  placeholder="رمز عبور"
                  prefix={<LockOutlined className="text-gray-400" />}
                  status={errors.password ? 'error' : ''}
                  className="rounded-xl"
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">نوع حساب کاربری:</p>
            <Controller
              name="is_teacher"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field} className="w-full flex flex-col gap-2">
                  <Radio value={false} className="text-base">
                    <span className="font-medium">دانشجو</span>
                  </Radio>
                  <Radio value={true} className="text-base">
                    <span className="font-medium">مدرس</span>
                  </Radio>
                </Radio.Group>
              )}
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="w-full rounded-2xl h-12 text-base font-semibold shadow-lg"
          >
            ثبت‌نام
          </Button>

          <div className="text-center text-sm text-gray-600">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              وارد شوید
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
