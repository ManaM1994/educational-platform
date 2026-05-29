import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/features/courses/coursesApi';
import { tutorsApi } from '@/features/tutors/tutorsApi';
import { blogApi } from '@/features/blog/blogApi';

export const homeQueryKeys = {
  popularCourses: ['home', 'popular-courses'] as const,
  featuredTutors: ['home', 'featured-tutors'] as const,
  latestBlogs: ['home', 'latest-blogs'] as const,
};

export function usePopularCourses() {
  return useQuery({
    queryKey: homeQueryKeys.popularCourses,
    queryFn: () => coursesApi.getPopular(6),
  });
}

export function useFeaturedTutors() {
  return useQuery({
    queryKey: homeQueryKeys.featuredTutors,
    queryFn: () => tutorsApi.getFeatured(6),
  });
}

export function useLatestBlogs() {
  return useQuery({
    queryKey: homeQueryKeys.latestBlogs,
    queryFn: () => blogApi.getLatest(3),
  });
}
