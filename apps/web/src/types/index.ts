export type SiteSetting={
  companyName:string;
  logo?: { url: string };
  footerText?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
};

export type About={
    title:string;
    description:any;
    mission?:any;
    vision?:any;
    aboutImg?:{ url: string,alternativeText?: string; };
}

export type Service = {
  id:number;
  title:string;
  slug:string;
  description: any;
  price?: number;
  image?:{ url: string } | null;
  isFeatured: boolean;
};

export type TeamMember = {
  id: number;
  name: string;
  designation: string;
  bio?: any;
  photo?: { url: string, alternativeText:string };
  email?: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  author: string;
  publishDate: string;
  blogContent: any;
  coverImage?: { url: string, alternativeText:string }  | null;
  isFeatured: boolean;
  subTxt?:string;
};

export type HomeProps= {
  siteSettings:SiteSetting|null;
  services: Service[];
  blogs:BlogPost[];
  error: string|null;
}

export type AppInitProps={
    pageProps: any
    settings?:any
}

export type ServiceProps={
  services: Service[];
  error?: string;
}

export type BlogsProps={
    initBlogs: BlogPost[]
}

export type BlogPostProps={
    initPost: BlogPost|null,
    slug:string;
}

export type AboutProps={
    aboutData:About|null,
    teamMem: TeamMember[],
    error?:string|null
}