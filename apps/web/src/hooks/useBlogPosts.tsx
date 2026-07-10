import { fetchStrapi } from '@/lib/strapi';
import { BlogPost } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useBlogPosts= (initData:BlogPost[]) => {
  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn:async () => {
      const res= await fetchStrapi('blog-posts?populate=coverImage&sort=publishDate:desc');
      return res.data;
    },
    staleTime:1000*60*2,
    initialData: initData,
    refetchOnWindowFocus: true
  });
};