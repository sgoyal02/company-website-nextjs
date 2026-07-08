import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { fetchFromStrapi } from '@/lib/strapi';

interface HomeProps {
  siteSettings: { company_name: string; tagline?: string } | null;
  services: Array<{ id: number; title: string; description: string }>;
  blogs: Array<{ id: number; title: string; slug: string; previewText: string }>;
  error?: string;
}

export default function Home({ siteSettings, services, blogs, error }: HomeProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{siteSettings?.company_name || 'Mindfire'}</title>
        <meta name="description" content="Welcome to our corporate platform" />
      </Head>

      <div className="space-y-20 pb-20">

        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24 px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            {siteSettings?.company_name || 'Welcome to Corporate Ventures'}
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            {siteSettings?.tagline || 'Leading digital scaling innovations across worldwide marketplaces.'}
          </p>
        </section>

        {/* Highlighted Services Grid */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Our Core Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{service.title}</h3>
                <p className="text-slate-600 line-clamp-3">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Latest Perspectives</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.previewText}</p>
                </div>
                <div className="px-6 pb-6">
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 text-sm font-semibold hover:underline">
                    Read Article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

// ssg data fetch
export const getStaticProps: GetStaticProps = async () => {
  try {
    const [settingsRes, servicesRes, blogsRes] = await Promise.all([
      fetchFromStrapi('site-setting'),
      fetchFromStrapi('services?pagination[limit]=3'),
      fetchFromStrapi('blog-posts?pagination[limit]=3&sort=date:desc'),
    ]);

    return {
      props: {
        siteSettings: settingsRes?.data || null,
        services: servicesRes?.data || [],
        blogs: blogsRes?.data || [],
      },
    };
  } catch (err) {
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