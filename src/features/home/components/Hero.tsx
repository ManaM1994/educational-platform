"use client";

import { Button } from "antd";
import Link from "next/link";
import { RocketOutlined, BookOutlined } from "@ant-design/icons";

export default function Hero() {
  return (
    <section className="relative bg-hero text-foreground py-20 md:py-28 px-4 overflow-hidden ">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptMC00YzEuMSAwIDItLjkgMi0ycy0uOS0yLTItMi0yIC45LTIgMiAuOSAyIDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
          <RocketOutlined />
          <span>پلتفرم آموزش آنلاین زبان انگلیسی</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-on-primary">
          زبان انگلیسی را با
          <span className="block mt-2">بهترین اساتید</span>
          یاد بگیرید
        </h1>

        <p className="text-lg md:text-xl text-on-primary/90 max-w-2xl leading-relaxed">
          دوره‌های تخصصی، اساتید مجرب و محتوای آموزشی جامع برای تمامی سطوح. از
          مبتدی تا پیشرفته، همراه شما هستیم
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Link href="/auth/register">
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              className="h-14 px-8 text-base font-semibold rounded-2xl btn-primary border-none hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
            >
              شروع رایگان
            </Button>
          </Link>
          <Link href="#courses">
            <Button
              size="large"
              icon={<BookOutlined />}
              className="h-14 px-8 text-base font-semibold rounded-2xl border-2 border-white text-white bg-transparent hover:bg-white/10 hover:border-white transition-all"
            >
              مشاهده دوره‌ها
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-8 justify-center mt-8 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">۱۰۰+</span>
            <span className="text-purple-200">دوره آموزشی</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">۵۰+</span>
            <span className="text-purple-200">مدرس مجرب</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">۱۰۰۰+</span>
            <span className="text-purple-200">دانشجوی فعال</span>
          </div>
        </div>
      </div>
    </section>
  );
}
