'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Card, message } from 'antd';
import { LockOutlined, MailOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, LoginData } from '@/features/auth/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/features/auth/authSlice';
import { queryClient } from '@/src/lib/queryClient';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginData) => {
    setLoading(true);
    try {
      await authApi.login(values);
      // const user = await authApi.me();
      // dispatch(setUser(user));
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      message.success('ورود با موفقیت انجام شد');
      router.push('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'ایمیل یا رمز عبور نادرست است';
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ورود</h1>
          <p className="text-gray-500">به حساب کاربری خود وارد شوید</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="w-full rounded-2xl h-12 text-base font-semibold shadow-lg"
          >
            ورود
          </Button>

          <div className="text-center text-sm text-gray-600">
            حساب کاربری ندارید؟{' '}
            <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              ثبت‌نام کنید
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
