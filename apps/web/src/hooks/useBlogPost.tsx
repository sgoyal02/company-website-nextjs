import { fetchStrapi } from '@/lib/strapi';
import { BlogPost } from '@/types';
import { useQuery } from '@tanstack/react-query';

type UseBlogPostProps = {
  slug: string;
  initData?: BlogPost|null;
};

export const useBlogPost= ({slug, initData}:UseBlogPostProps) => {
  return useQuery<BlogPost| undefined>({
    queryKey: ['blogPost', slug],
    queryFn:async() => {
      const res= await fetchStrapi(`blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=coverImage`);
      return res.data[0];
    },
    staleTime:1000*60*2,
    initialData:initData||undefined,
    enabled: !!slug
  });
};