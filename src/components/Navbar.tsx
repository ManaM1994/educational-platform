"use client";

import { Button, Dropdown, Avatar } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { authApi } from "@/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser } from "@/features/auth/authSlice";
import { toggleTheme } from "@/features/theme/themeSlice";
import { message } from "antd";
import { queryClient } from "../lib/queryClient";

const navLinks = [
  { label: "خانه", href: "/" },
  { label: "دوره‌ها", href: "#courses" },
  { label: "اساتید", href: "#tutors" },
  { label: "مقالات", href: "#blogs" },
];

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const theme = useAppSelector((state) => state.theme.mode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      dispatch(clearUser());
      message.success("خروج با موفقیت انجام شد");
      router.push("/");
    } catch {
      message.error("خطا در خروج از حساب");
    } finally {
      setLoggingOut(false);
    }
  };

  const userMenuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: user?.is_teacher ? "داشبورد مدرس" : "داشبورد دانشجو",
      onClick: () =>
        router.push(
          user?.is_teacher ? "/tutor-dashboard" : "/student-dashboard",
        ),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "خروج",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="bg-header shadow-sm sticky top-0 z-50 border-b border-theme transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-purple-600 dark:text-purple-400 font-bold text-2xl hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center">
            <BookOutlined className="text-white text-xl" />
          </div>
          <span>EnglishTrain</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-purple-600 transition-colors text-base font-medium relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            type="text"
            icon={
              theme === "dark" ? (
                <BulbFilled className="text-yellow-400" />
              ) : (
                <BulbOutlined className="text-muted" />
              )
            }
            onClick={() => dispatch(toggleTheme())}
            className={`hover:bg-purple-50 dark:hover:bg-gray-800 ${theme === "dark" ? "text-white" : "text-foreground"}`}
            size="large"
          />

          {isAuthenticated && user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-purple-50 px-4 py-2 rounded-xl transition-all">
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  className="border-2 border-theme"
                />
                <span className="text-sm font-semibold text-foreground">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Link href="/auth/login">
                <Button size="large" className="rounded-xl font-medium">
                  ورود
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  type="primary"
                  size="large"
                  className="rounded-xl font-medium bg-linear-to-r from-purple-600 to-pink-500 border-none hover:from-purple-700 hover:to-pink-600"
                >
                  ثبت‌نام رایگان
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-muted hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <MenuOutlined className="text-xl" />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-header border-t border-theme px-4 pb-4 flex flex-col gap-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-purple-600 text-base font-medium py-2 px-2 hover:bg-purple-50 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Button
            type="text"
            icon={
              theme === "dark" ? (
                <BulbFilled className="text-yellow-400" />
              ) : (
                <BulbOutlined />
              )
            }
            onClick={() => dispatch(toggleTheme())}
            className={`hover:bg-purple-50 dark:hover:bg-gray-800 w-full ${theme === "dark" ? "text-white" : "text-foreground"}`}
            size="large"
          >
            {theme === "dark" ? "حالت روشن" : "حالت تاریک"}
          </Button>

          {isAuthenticated && user ? (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  src={
                    user.profile_picture ? `${user.profile_picture}` : undefined
                  }
                  className="border-2 border-theme"
                />
                <span className="text-sm font-semibold text-foreground">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <Button
                icon={<DashboardOutlined />}
                onClick={() => {
                  router.push(
                    user.is_teacher ? "/tutor-dashboard" : "/student-dashboard",
                  );
                  setMobileOpen(false);
                }}
                className="w-full rounded-xl"
              >
                داشبورد
              </Button>
              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                loading={loggingOut}
                className="w-full rounded-xl"
              >
                خروج
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/auth/login" className="w-full">
                <Button size="large" className="rounded-xl w-full font-medium">
                  ورود
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button
                  type="primary"
                  size="large"
                  className="rounded-xl w-full font-medium bg-linear-to-r from-purple-600 to-pink-500 border-none"
                >
                  ثبت‌نام رایگان
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
