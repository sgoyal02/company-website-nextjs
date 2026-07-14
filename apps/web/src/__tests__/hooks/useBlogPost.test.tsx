import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBlogPost } from '@/hooks/useBlogPost';
import { fetchStrapi } from '@/lib/strapi';

jest.mock('@/lib/strapi', () => ({
  fetchStrapi: jest.fn(),
}));
const mockedFetchStrapi = fetchStrapi as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

//mockData--
const mockPost = {
  id: 1,
  title: 'Test Blog',
  slug: 'test-blog',
  author: 'User',
  publishDate: '2026-07-10',
  blogContent: [],
  isFeatured: true,
  coverImage: null,
};

describe('blog post hook- tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('init data return-test', () => {
    const { result } = renderHook(() => useBlogPost({ slug: 'test-blog', initData: mockPost }), {
      wrapper: createWrapper(),
    });
    expect(result.current.data).toEqual(mockPost);
    expect(mockedFetchStrapi).not.toHaveBeenCalled();
  });

  it('get blog data with slug- test', async () => {
    mockedFetchStrapi.mockResolvedValue({ data: [mockPost] });
    const { result } = renderHook(() => useBlogPost({ slug: 'test-blog' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPost);
    });
    expect(mockedFetchStrapi).toHaveBeenCalledWith(expect.stringContaining('test-blog'));
  });

  it('no data on emoty slug -test', () => {
    renderHook(() => useBlogPost({ slug: '' }), { wrapper: createWrapper() });
    expect(mockedFetchStrapi).not.toHaveBeenCalled();
  });

  it('empty api data- test', async () => {
    mockedFetchStrapi.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useBlogPost({ slug: 'no-post' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });
  });
});
