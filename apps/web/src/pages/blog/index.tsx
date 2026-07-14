import { GetStaticProps } from 'next';
import Link from 'next/link';
import { BlogsProps } from '@/types';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { fetchStrapi } from '@/lib/strapi';
import Image from 'next/image';
import { STRAPI_URL } from '@/constants/CONFIG';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function BlogPage({ initBlogs }: BlogsProps) {
  const { data: blogs = initBlogs, isLoading, isFetching, error, refetch } = useBlogPosts(initBlogs);
  const [searchTxt, setSearchTxt] = useState("");
  const debounceSearch = useDebounce(searchTxt, 400);

  const filteredBlogs = useMemo(() => {
    if (!debounceSearch.trim())
      return blogs;

    const inpSearch = debounceSearch.toLowerCase();
    return blogs.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const subTxt = post.subTxt?.toLowerCase() || "";
      return (title.includes(inpSearch) || subTxt.includes(inpSearch));
    })
  }, [blogs, debounceSearch]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Blogs load error</h2>
          <p className="text-slate-600 text-md mb-4">{(error as Error).message}</p>
          <button onClick={() => refetch()} className="btn btn-primary">
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
        {isFetching && (
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-md bg-primary animate-pulse" />
            Updating...
          </span>
        )}
      </div>
      {/*search-ui-- */}
      <div className="mb-10 relative w-full max-w-xl">
        <div className="relative group">
        <input value={searchTxt}
          onChange={(e) =>
            setSearchTxt(e.target.value)
          }
          placeholder="Search blogs.."
          className="w-full rounded-md borderborder-slate-200
        bg-white px-5 py-3 pr-12 text-slate-900 text-sm shadow-sm outline-none
        focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2
            text-slate-400 group-focus-within:text-primary transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z" />
        </svg>
        </div>
        </div>
        {searchTxt && (
          <p className="mt-2 text-sm text-slate-500">
            Showing {filteredBlogs.length} results
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((post) => (
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
                <h3 className="text-xl font-semibold line-clamp-2 mb-4 group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="text-slate-600 line-clamp-3 text-[15px]">{post.subTxt}</p>
                <button className="btn btn-accent w-full btn-accent:hover hover:cursor-pointer mt-2">
                  View Post
                </button>
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
