import {
  BookOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-header text-muted py-12 px-4 border-t border-theme">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-foreground font-bold text-xl"
            >
              <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center">
                <BookOutlined className="text-on-primary" />
              </div>
              <span>EnglishTrain</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted">
              بهترین پلتفرم آموزش آنلاین زبان انگلیسی با اساتید مجرب و دوره‌های
              جامع برای تمامی سطوح
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-foreground font-semibold text-lg mb-2">
              دسترسی سریع
            </h4>
            <Link
              href="/"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              خانه
            </Link>
            <Link
              href="#courses"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              دوره‌ها
            </Link>
            <Link
              href="#tutors"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              اساتید
            </Link>
            <Link
              href="#blogs"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              مقالات
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-foreground font-semibold text-lg mb-2">
              حساب کاربری
            </h4>
            <Link
              href="/auth/login"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              ورود
            </Link>
            <Link
              href="/auth/register"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              ثبت‌نام
            </Link>
            <Link
              href="/student-dashboard"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              داشبورد دانشجو
            </Link>
            <Link
              href="/tutor-dashboard"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              داشبورد مدرس
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-foreground font-semibold text-lg mb-2">
              تماس با ما
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <MailOutlined className="text-purple-400" />
              <span>info@englishtrain.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PhoneOutlined className="text-purple-400" />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <EnvironmentOutlined className="text-purple-400" />
              <span>تهران، ایران</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-muted">
            © {new Date().getFullYear()} EnglishTrain — تمامی حقوق محفوظ است
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-muted hover:text-purple-400 transition-colors"
            >
              قوانین و مقررات
            </Link>
            <Link
              href="#"
              className="text-muted hover:text-purple-400 transition-colors"
            >
              حریم خصوصی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
