import { render, screen } from '@testing-library/react';
import AboutPage from '@/pages/about';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@strapi/blocks-react-renderer', () => ({
  BlocksRenderer: ({ content }: any) => (
    <div data-testid="blocks-renderer">
      {JSON.stringify(content)}
    </div>
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
];

const mockAboutData = {
  title: 'About Us',
  description: mockBlocks,
  mission: mockBlocks,
  vision: mockBlocks,
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('About page-tests', () => {
  it('test- about page title', () => {
    render(<AboutPage aboutData={mockAboutData} teamMem={[]} error={null}/>);
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('errtest- about data fails', () => {
    render(
      <AboutPage
        aboutData={null}
        teamMem={[]}
        error="Failed to load about page"
      />
    );
    expect(screen.getByText('About page load error')).toBeInTheDocument();
    expect(
      screen.getByText('Failed to load about page')
    ).toBeInTheDocument();
  });
});