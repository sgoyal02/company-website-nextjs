import { GetStaticProps, GetStaticPaths } from 'next';
import { BlogPostProps, BlogSlugRes } from '@/types';
import { useBlogPost } from '@/hooks/useBlogPost';
import { fetchStrapi } from '@/lib/strapi';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { formatDate } from '@/utils/helpers';
import { STRAPI_URL } from '@/constants/CONFIG';

export default function BlogDetail({ initPost, slug }: BlogPostProps) {
  const {data:post= initPost, isLoading, error }=useBlogPost({slug, initData: initPost});
  if (error||!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Post not found.</h2>
          {error && <p className="text-slate-600 text-md mb-6">{(error as Error).message}</p>}
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {post.coverImage?.url && (
        <div className="relative overflow-hidden rounded-md w-full h-72 mb-2">
        <Image
          src={`${STRAPI_URL}${post.coverImage.url}`}
          alt={post.title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        </div>
      )}

      <div className="mb-10">
        <p className="text-sm text-slate-500">
          {formatDate(post.publishDate)}- By {post.author}
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mt-6 leading-tight">{post.title}</h1>
      </div>

      {isLoading ? 
      <p className="text-center text-slate-500 mt-8">Loading content...</p>
      :
      <div className="max-w-none text-slate-700">
       <BlocksRenderer content={post.blogContent || post.subTxt} />
       </div>
    }
    </article>
  );
};

//staticpath get-
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetchStrapi('blog-posts?fields[0]=slug');
    const paths = res.data.map((post: BlogSlugRes) => ({
      params: { slug: post.slug },
    }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<BlogPostProps>= async({ params }) => {
  const slugPart= params?.slug  ?? "";
   const slug = typeof slugPart === "string" ? slugPart
                : Array.isArray(slugPart) ? slugPart[0] : "";
  try {
    const res = await fetchStrapi(`blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=coverImage`);
    return {
      props: {
        initPost: res.data[0] || null,
        slug: params?.slug as string,
      },
      revalidate: 60,
    };
  } catch {
    return {
      props: {initPost: null, slug: params?.slug as string },
    };
  }
};