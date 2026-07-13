import { render, screen } from "@testing-library/react";
import BlogDetail, {getStaticPaths,getStaticProps} from "@/pages/blog/[slug]";
import { useBlogPost } from "@/hooks/useBlogPost";
import { fetchStrapi } from "@/lib/strapi";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { BlogPost } from "@/types";

//mocks init-

jest.mock("@/hooks/useBlogPost", () => ({
  useBlogPost: jest.fn(),
}));
jest.mock("@/lib/strapi", () => ({
  fetchStrapi: jest.fn(),
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

jest.mock("@/utils/helpers", () => ({
  formatDate: jest.fn(() => "10 July 2026"),
  formatFulltDate: jest.fn(() => "10 July 2026"),
}));

jest.mock("@strapi/blocks-react-renderer", () => ({
  BlocksRenderer: ({ content }: {content:unknown}) => (
    <div data-testid="blocks-renderer">
      {JSON.stringify(content)}
    </div>
  ),
}));

//data-

const mockPost = {
  id: 1,
  title: "Next.js for Modern Web Development",
  slug: "next-js-for-modern-web-development",
  author: "Sakshi Goyal",
  publishDate: "2026-07-10",
  isFeatured: true,
  subTxt: "Learn how Next.js helps developers build scalable applications.",
  blogContent: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Next.js blog content",
        },
      ],
    },
  ],
  coverImage: {
    url: "/nextjs.jpg",
    alternativeText: "Next image",
  },
}satisfies BlogPost;

//util-
const mockUseBlogPost = (
  overrides = {}
) => {
  (useBlogPost as jest.Mock).mockReturnValue({
    data: mockPost,
    isLoading: false,
    error: null,
    ...overrides,
  });
};
const renderPage = () => {
  return render(
    <BlogDetail
      initPost={mockPost}
      slug="next-js-for-modern-web-development"
    />
  );
};

describe("blog post-testing", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseBlogPost();
    });

    it("blog detail ui-test", () => {
        renderPage();
        expect(screen.getByText("Next.js for Modern Web Development")).toBeInTheDocument();
        expect(screen.getByText(/By Sakshi Goyal/)).toBeInTheDocument();
        expect(screen.getByTestId("blocks-renderer")).toHaveTextContent("Next.js blog content");
    });

    
    it("err on post fail-test", () => {
        mockUseBlogPost({data: null,error: new Error("Failed to load post")});
        renderPage();
        expect(screen.getByText("Post not found.")).toBeInTheDocument();
        expect(screen.getByText("Failed to load post")).toBeInTheDocument();
    });

    it("loading when load post-test", () => {
        mockUseBlogPost({isLoading: true});
        renderPage();
        expect(screen.getByText("Loading content...")).toBeInTheDocument();
  });
});

describe("blogpost getstatic path-testing", ()=>{
    it("blog slug path -tst", async () => {
        (fetchStrapi as jest.Mock).mockResolvedValue({
            data: [{slug: "first-post"},{slug: "second-post"}]
        });
        const result = await getStaticPaths({} as GetStaticPathsContext);
        expect(fetchStrapi).toHaveBeenCalledWith("blog-posts?fields[0]=slug");
        expect(result).toEqual({
            paths: [
            {params: {
                slug: "first-post",
            }},
            {params: {
                slug: "second-post",
            }},
            ],
            fallback: "blocking",
        });
    });

    it("strapi fail empty path- test", async () => {
        (fetchStrapi as jest.Mock).mockRejectedValue(new Error("API error"));
        const res = await getStaticPaths({} as GetStaticPathsContext);
        expect(res).toEqual({
        paths: [],
        fallback: "blocking",
        });
    });
});


describe("blogpost getsstatic prop- testing", ()=>{
    it("blog post get and return prop- test", async () => {
        (fetchStrapi as jest.Mock).mockResolvedValue({
            data: [mockPost]
        });

        const res = await getStaticProps({
        params:{
            slug:
            "next-js-for-modern-web-development",
        }
        } as GetStaticPropsContext);
        expect(fetchStrapi).toHaveBeenCalledWith(
            "blog-posts?filters[slug][$eq]=next-js-for-modern-web-development&populate=coverImage"
        );
        expect(res).toEqual({
        props: {
            initPost: mockPost,
            slug:
            "next-js-for-modern-web-development",
        },
        revalidate: 60,
        });
    });

    it("empty data return null post- test", async () => {
        (fetchStrapi as jest.Mock).mockResolvedValue({
            data: [],
        });
        const res = await getStaticProps({
        params: {
            slug: "missing-post",
        },
        } as GetStaticPropsContext);

        expect(res).toEqual({
        props: {
            initPost: null,
            slug: "missing-post",
        },
        revalidate: 60,
        });
    });

});
