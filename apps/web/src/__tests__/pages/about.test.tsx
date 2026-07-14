import { render, screen } from '@testing-library/react';
import AboutPage from '@/pages/about';
import { StrapiRichText } from '@/types';

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

jest.mock('@strapi/blocks-react-renderer', () => ({
  BlocksRenderer: ({ content }: { content: unknown }) => (
    <div data-testid="blocks-renderer">{JSON.stringify(content)}</div>
  ),
}));

const mockBlocks = [
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Sample content',
      },
    ],
  },
] satisfies StrapiRichText;

const mockAboutData = {
  title: 'About Us',
  description: mockBlocks,
  mission: mockBlocks,
  vision: mockBlocks,
};

describe('About page-tests', () => {
  it('test- about page title', () => {
    render(<AboutPage aboutData={mockAboutData} teamMem={[]} error={null} />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('errtest- about data fails', () => {
    render(<AboutPage aboutData={null} teamMem={[]} error="Failed to load about page" />);
    expect(screen.getByText('About page load error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load about page')).toBeInTheDocument();
  });
});
