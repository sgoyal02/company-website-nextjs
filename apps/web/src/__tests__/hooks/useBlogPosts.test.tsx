import { renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { fetchStrapi } from "@/lib/strapi";

jest.mock("@/lib/strapi",()=>({
  fetchStrapi:jest.fn()
}));
const mockedFetchStrapi= fetchStrapi as jest.Mock;

const createWrapper = () => {
  const queryClient =
    new QueryClient({defaultOptions:{
        queries:{
          retry:false,
          staleTime:0,
        },
      },
    });

  return function Wrapper({children}:{children:React.ReactNode}){
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

//mockData--
const mockBlogs =  [
  {
    id: 1,
    title: "Nextjs Testing",
    slug: "nextjs-testing",
    author: "Sakshi",
    publishDate: "2026-07-10",
    blogContent: [],
    isFeatured: true,
    coverImage: null,
  },
  {
    id: 2,
    title: "React Query Test",
    slug: "react-query-test",
    author: "Rhea",
    publishDate: "2026-07-09",
    blogContent: [],
    isFeatured: false,
    coverImage: null,
  },
];

describe("blogs hook- tests", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it("init data return-test", ()=>{
        const {result} = renderHook(()=>useBlogPosts(mockBlogs), {wrapper:createWrapper()});
        expect(result.current.data).toEqual(mockBlogs);
        expect(mockedFetchStrapi).not.toHaveBeenCalled();
    });

    it("get blogs from api- test", async()=>{
        mockedFetchStrapi.mockResolvedValue({data:mockBlogs});
        const {result} = renderHook(()=>useBlogPosts(), {wrapper:createWrapper()});

        await waitFor(()=>{
            expect(mockedFetchStrapi).toHaveBeenCalled();
        });
        await waitFor(()=>{
            expect(result.current.data).toEqual(mockBlogs);
        })
        expect(mockedFetchStrapi).toHaveBeenCalledWith(
            "blog-posts?populate=coverImage&sort=publishDate:desc"
        );
    });

    it("api fail-test", async()=>{
        mockedFetchStrapi.mockRejectedValue(new Error('API failed'))
        const {result}= renderHook(()=>useBlogPosts(), {wrapper:createWrapper()});
        await waitFor(()=>{
            expect(result.current.isError).toBe(true);
        })
        expect(result.current.error).toBeDefined();
    });

    it("empty api data- test", async()=>{
        mockedFetchStrapi.mockResolvedValue({data:[]});
        const {result} = renderHook(()=>useBlogPosts(), {wrapper:createWrapper()});
        await waitFor(()=>{
            expect(result.current.data).toEqual([]);
        })
    });
})