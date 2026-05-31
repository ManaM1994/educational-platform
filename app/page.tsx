"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/features/home/components/Hero';
import PopularCourses from '@/features/home/components/PopularCourses';
import FeaturedTutors from '@/features/home/components/FeaturedTutors';
import LatestBlogs from '@/features/home/components/LatestBlogs';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div id="courses">
          <PopularCourses />
        </div>
        <div id="tutors">
          <FeaturedTutors />
        </div>
        <div id="blogs">
          <LatestBlogs />
        </div>
      </main>
      <Footer />
    </>
  );
}
