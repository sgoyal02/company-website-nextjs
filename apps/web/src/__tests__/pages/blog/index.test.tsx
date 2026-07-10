import { render, screen } from '@testing-library/react';
import BlogPage from '@/pages/blog';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/hooks/useBlogPosts', () => ({
  useBlogPosts: jest.fn(),
}));
import { useBlogPosts } from '@/hooks/useBlogPosts';

const mockBlogs = [
  {
    id: 1,
    title: 'Why Businesses Need Custom Software',
    slug: 'why-businesses-need-custom-software',
    author: 'Sakshi goyal',
    publishDate: '2026-07-10',
    isFeatured:true,
    subTxt: 'Custom software solutions help businesses grow.',
    coverImage: {
      url: '/software.jpg',
      alternativeText:"abc"
    },
     blogContent: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Some blog content',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Benefits of Cloud Applications',
    slug: 'cloud-applications-benefits',
    author: 'Jane Smith',
    publishDate: '2026-07-09',
    isFeatured:false,
    subTxt: 'Cloud technology improves scalability.',
    coverImage: null,
     blogContent: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'A blog content',
          },
        ],
      },
    ],
  },
];


describe('Blogs page- tests', () => {
  beforeEach(() => {
    (useBlogPosts as jest.Mock).mockReturnValue({
      data: mockBlogs,
      isLoading: false,
      error: null,
    });
  });

  it('blog hedaing-test', () => {

    render(
      <BlogPage initBlogs={mockBlogs} />
    );
    expect(screen.getByText('Latest insights and updates')).toBeInTheDocument();

  });



  it('blog render- testing', () => {
    render(
      <BlogPage initBlogs={mockBlogs} />
    );
    expect(
      screen.getByText('Why Businesses Need Custom Software')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefits of Cloud Applications')
    ).toBeInTheDocument();

  });


  it('shows loading state while fetching blogs', () => {
    (useBlogPosts as jest.Mock).mockReturnValue({
      data: mockBlogs,
      isLoading: true,
      error: null,
    });

    render(
      <BlogPage initBlogs={mockBlogs} />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();

  });

});