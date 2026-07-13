import { STRAPI_URL } from '@/constants/CONFIG';
import { fetchStrapi } from '@/lib/strapi';
import { About, AboutProps } from '@/types';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { GetStaticProps } from 'next';
import Image from 'next/image';

export default function AboutPage({ aboutData, error, teamMem }: AboutProps) {
    if (error || !aboutData) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">About page load error</h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className=" mx-auto px-6 py-10">
            <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    {aboutData.title || "About Us"}
                </h3>
                <div className=" text-slate-600">
                    <BlocksRenderer content={aboutData.description} />
                </div>
            </div>


            <div className="relative w-full h-[420px] rounded-md overflow-hidden mb-10 shadow-lg">
                {aboutData.aboutImg?.url && (
                    <Image
                        src={`${STRAPI_URL}${aboutData.aboutImg.url}`}
                        alt={aboutData.aboutImg.alternativeText || "About Us"}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="service-card p-10">
                    <h2 className="text-2xl font-semibold text-primary mb-6">Our Mission</h2>
                    <div className="text-sm leading-relaxed text-slate-600">
                        {aboutData.mission && 
                        <BlocksRenderer content={aboutData.mission} />
                        }
                    </div>
                </div>

                <div className="service-card p-10">
                    <h2 className="text-2xl font-semibold text-primary mb-6">Our Vision</h2>
                    <div className="text-sm leading-relaxed text-slate-600">
                        {aboutData.vision && <BlocksRenderer content={aboutData.vision} />}
                    </div>
                </div>
            </div>


            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-center mb-12 text-primary">Meet Our Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMem.length > 0 ? (
                        teamMem?.map((user) => (
                            <div key={user.id} className="team-card text-center">
                                <div className="relative w-40 h-40 mx-auto mb-6 rounded-md overflow-hidden shadow-md">
                                        <Image
                                            src={user.photo?.url ? `${STRAPI_URL}${user.photo.url}` : '/noImg.jpg'}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                                <p className="text-primary font-medium mt-1">{user.designation}</p>

                                {user.email && (
                                    <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                                )}
                                <div className='text-slate-600 mt-6 text-left line-clamp-4'>
                                    {user.bio && <BlocksRenderer content={user.bio || ""}/>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-slate-500 py-12">No team members yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

//ssg, isr
export const getStaticProps: GetStaticProps<AboutProps> = async () => {
    try {
        const res= await Promise.allSettled([
                    fetchStrapi('about?populate=aboutImg'),
                    fetchStrapi('team-members?populate=photo'),
    ]);
    const aboutData= res[0].status === 'fulfilled' ? res[0].value : null;
    const teamData= res[1].status === 'fulfilled' ? res[1].value : null;
        return {
            props: { 
            aboutData:aboutData?.data || ({} as About), 
            teamMem:teamData?.data||[], 
            error:!aboutData ? "Fail to load about page" : null 
        },
        revalidate: 60,
        };
    } catch{
        return {
            props: {
                aboutData: null,
                teamMem:[],
                error: "Fail to load about page content!",
            },
            revalidate: 30,
        };
    }
};