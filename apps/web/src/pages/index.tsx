import Head from 'next/head';
import { GetStaticProps } from 'next';
import { fetchStrapi } from '@/lib/strapi';
import { HomeProps, SiteSetting } from '@/types';
import { blockToTxt } from '@/utils/helpers';
import Image from 'next/image';
import { STRAPI_URL } from '@/constants/CONFIG';

export default function Home({ siteSettings, services, blogs, error }: HomeProps) {
  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Unable to load page</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{siteSettings?.companyName || 'Company website'}</title>
        <meta name="description" content={siteSettings?.bannerSubtitle || ''} />
        {siteSettings?.logo?.url && (
          <link rel="icon" href={`${STRAPI_URL}${siteSettings.logo.url}`} />
        )}
      </Head>

      <section className="banner py-24 md:py-32 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-white">
            {siteSettings?.bannerTitle || 'Welcome to our company'}
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">
            {siteSettings?.bannerSubtitle ?? ''}
          </p>
        </div>
      </section>

      {/* service-- */}
      <section className="py-16 md:py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900">Our Services</h2>
          {/* <p className="text-slate-600 mt-3 text-lg">Professional solutions for your business</p> */}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="relative w-full h-50 mb-6 overflow-hidden rounded-md">
                  <Image
                    src={service.image?.url ? `${STRAPI_URL}${service.image.url}` : '/noImg.jpg'}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-slate-600 line-clamp-4 mb-6">
                  {blockToTxt(service.description)}
                </p>
                {service.price && (
                  <p className="text-xl font-bold text-primary mt-auto">Rs.{service.price}</p>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-slate-500 py-12">No services available.</p>
          )}
        </div>
      </section>

      {/*blogs-- */}
      <section className="py-16 bg-slate-50 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900">Latest Blogs</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.length > 0 ? (
            blogs.map((post) => (
              <div key={post.id} className="blog-card overflow-hidden group cursor-pointer">
                <div className="relative w-full h-50 overflow-hidden">
                  <Image
                    src={
                      post?.coverImage?.url ? `${STRAPI_URL}${post.coverImage.url}` : '/noImg.jpg'
                    }
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-3">
                    {new Date(post.publishDate).toLocaleDateString('en-IN')}
                  </p>
                  <h3 className="text-xl font-semibold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 text-[15px] leading-relaxed">
                    {post.subTxt || ''}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-slate-500 py-12">No blogs available.</p>
          )}
        </div>
      </section>
    </>
  );
}

//ssg fetch-
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const res = await Promise.allSettled([
      fetchStrapi('site-setting?populate=*'),
      fetchStrapi('services?populate=image&filters[isFeatured]=true&pagination[limit]=3'),
      fetchStrapi('blog-posts?populate=coverImage&filters[isFeatured]=true&pagination[limit]=3'),
    ]);
    const compRes = res[0].status === 'fulfilled' ? res[0].value : null;
    const servicesRes = res[1].status === 'fulfilled' ? res[1].value : null;
    const blogsRes = res[2].status === 'fulfilled' ? res[2].value : null;

    return {
      props: {
        siteSettings: compRes?.data || ({} as SiteSetting),
        services: servicesRes?.data || [],
        blogs: blogsRes?.data || [],
        error: !compRes ? 'Fail to load company data' : null,
      },
      revalidate: 60, //forisr
    };
  } catch {
    return {
      props: {
        siteSettings: null,
        services: [],
        blogs: [],
        error: 'Fail to sync cms records',
      },
    };
  }
};
