
import { GetStaticProps } from 'next';
import { ServiceProps } from '@/types';
import { fetchStrapi } from '@/lib/strapi';
import { blockToTxt } from '@/utils/helpers';
import Image from 'next/image';

export default function ServicesPage({ services, error }:ServiceProps) {
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">{"Service load error"}</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Our Services</h1>
        <p className="text-slate-600 text-md max-w-2xl mx-auto">
          We provide high quality professional services to meet your business needs.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.length> 0 ? (
          services.map((service) => (
            <div key={service.id} className="service-card group">
                <div className="relative overflow-hidden rounded-md mb-4 border w-full h-52 border-card-border">
                  <Image
                    src={service.image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${service.image.url}` : '/noImg.jpg'}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              <div className="p-2">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed line-clamp-5 mb-6 text-sm">
                  {blockToTxt(service.description)}
                </p>
                {service.price!==undefined && (
                  <p className="text-2xl font-bold text-primary mb-6">Rs {service.price}</p>
                )}
                <button className="btn btn-primary w-full">
                  Learn More
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-500">
            No service available.
          </div>
        )}
      </div>
    </div>
  );
}

// ssg and isr get-
export const getStaticProps: GetStaticProps<ServiceProps>= async () => {
  try {
    const res = await fetchStrapi('services?populate=image');
    return {props: {
        services: res.data,
      },
      revalidate: 60,
    };
  }catch (err) {
    // const errMsg =err instanceof Error ? err.message : "Unknown error";
    return {
      props: {
        services: [],
        error: "Fail to load service- try again.",
      },
      revalidate: 30,
    };
  }
};