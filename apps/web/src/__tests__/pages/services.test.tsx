import { render, screen } from "@testing-library/react";
import ServicesPage, {getStaticProps } from "@/pages/services";
import { fetchStrapi } from "@/lib/strapi";
import { blockToTxt } from "@/utils/helpers";
import { GetStaticPropsContext } from "next";
import { ServiceProps } from "@/types";

//mock--
jest.mock("@/lib/strapi", () => ({
  fetchStrapi: jest.fn(),
}));
jest.mock("@/utils/helpers", () => ({
  blockToTxt: jest.fn(() => "Service description"),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    unoptimized: _unoptimized,
    priority: _priority,
    ...props
  }: {
    fill?: boolean;
    unoptimized?: boolean;
    priority?: boolean;
    src: string;
    alt?: string;
    [key: string]: unknown;
  }) => <img {...props} alt={props.alt || ''} />,
}));

//mock data-
const mockServices = [
  {
    id:1,
    title:"Web Development",
    slug:"web-development",
    description: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "Build modern websites",
          },
        ],
      },
    ],
    price:5000,
    image:{
      url:"/web.jpg"
    },
    isFeatured:true
  },
  {
    id:2,
    title:"SEO Service",
    slug:"seo-service",
     description: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "Improve ranking",
          },
        ],
      },
    ],
    price:0,
    image:null,
    isFeatured:false
  }
]satisfies ServiceProps["services"];

//testing--
describe("page comp tests",()=>{
    it("render ui-test",()=>{
        render(<ServicesPage services={mockServices}/>);
        expect(screen.getByText('Our Services')).toBeInTheDocument();
        expect(screen.getByAltText('Web Development')).toBeInTheDocument();
        expect(blockToTxt).toHaveBeenCalled();
    });

    it("alt img when no service img- test", ()=>{
        render(<ServicesPage services={
            [{...mockServices[1], image:undefined}]
        }/>
        );
        const imgVar=screen.getByAltText('SEO Service');
        expect(imgVar).toHaveAttribute("src", '/noImg.jpg');
    });

    it("no service empty state-test", ()=>{
        render(<ServicesPage services={[]}/>);
        expect(screen.getByText("No service available.")).toBeInTheDocument();
    });

    it("error state-test", ()=>{
         render(<ServicesPage services={[]} error="Server error"/>);
         expect(screen.getByText("Service load error")).toBeInTheDocument();
         expect(screen.getByRole("button", {name:"Retry"})).toBeInTheDocument();

    })
});

describe("getstaticprops service- test", ()=>{
     beforeEach(()=>{
        jest.clearAllMocks();
     });

    it("get service return prop- test", async()=>{
        (fetchStrapi as jest.Mock).mockResolvedValue({data:mockServices});
        const res= await getStaticProps({} as GetStaticPropsContext);
        expect(fetchStrapi).toHaveBeenCalledWith("services?populate=image");
        expect(res).toEqual({
            props:{services: mockServices},
            revalidate:60
        })
    });

    it("strapi fail -test", async()=>{
        (fetchStrapi as jest.Mock).mockRejectedValue(new Error('API failed'));
        const res= await getStaticProps({} as GetStaticPropsContext);
        expect(res).toEqual({
            props:{ services:[], error:"Fail to load service- try again."},
            revalidate:30
        })
    });

    it("no service res- test", async()=>{
        (fetchStrapi as jest.Mock).mockResolvedValue({data:[]});
        const res= await getStaticProps({} as GetStaticPropsContext);
        expect(res).toEqual({
            props:{ services:[]},
            revalidate:60
        })
    })

    it("service without optional fields- test", ()=>{
        const testData={
            id:3,
            title:"Testing service",
            slug:"testing",
            description:[],
            isFeatured:false
        };
        render(<ServicesPage services={[testData]}/>);
        expect(screen.getByText("Testing service")).toBeInTheDocument();
    })
})