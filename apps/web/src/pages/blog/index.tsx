import { GetStaticProps } from 'next';
import Link from 'next/link';
import { BlogsProps } from '@/types';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { fetchStrapi } from '@/lib/strapi';
import Image from 'next/image';
import { STRAPI_URL } from '@/constants/CONFIG';

export default function BlogPage({ initBlogs }: BlogsProps) {
  const { data: blogs = initBlogs, isLoading, error } = useBlogPosts(initBlogs);
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Blogs load error</h2>
          <p className="text-slate-600 text-md mb-4">{(error as Error).message}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Our Blogs</h1>
          <p className="text-slate-600 mt-2 text-md">Latest insights and updates</p>
        </div>
        {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length > 0 ? (
          blogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card group block">
              <div className="relative overflow-hidden rounded-md w-full h-52">
                <Image
                  src={post.coverImage?.url ? `${STRAPI_URL}${post.coverImage.url}` : '/noImg.jpg'}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2">
                <p className="text-sm text-slate-500 mb-3">
                  {new Date(post.publishDate).toLocaleDateString('en-IN')}- {post.author}
                </p>
                <h3 className="text-xl font-semibold line-clamp-2 mb-4 group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="text-slate-600 line-clamp-3 text-[15px]">{post.subTxt}</p>
                <button className="btn btn-primary w-full btn-primary:hover">View Post</button>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center py-20 text-slate-500">No posts available.</p>
        )}
      </div>
    </div>
  );
}

//ssg and isr-
export const getStaticProps: GetStaticProps<BlogsProps> = async () => {
  try {
    const res = await fetchStrapi('blog-posts?populate=coverImage&sort=publishDate:desc');
    return {
      props: { initBlogs: res.data },
      revalidate: 60,
    };
  } catch {
    return {
      props: { initBlogs: [] },
      revalidate: 30,
    };
  }
};
