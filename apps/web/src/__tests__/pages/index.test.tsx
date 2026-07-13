import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import { HomeProps } from '@/types';

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

const mockHomeData = {
  siteSettings: {
    companyName: 'Mindfire Solutions',
    bannerTitle: 'Build better digital experiences',
    bannerSubtitle: 'Custom software solutions for modern business',
  },
  services: [
    {
      id: 1,
      title: 'Web Development',
      price: 50000,
    slug: 'web-development',
      isFeatured: true,
      description: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Modern web applications',
            },
          ],
        },
      ],
      image: {
        url: '/web-dev.jpg',
      },
    },
    {
      id: 2,
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      isFeatured: true,
      price: 80000,
      description: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Android and iOS apps',
            },
          ],
        },
      ],
    },
  ],

  blogs: [],
} satisfies Omit<HomeProps, "error">;


describe('Home page tests-', () => {


  it('company info -test', () => {
    render(
      <Home
        {...mockHomeData}
        error={null}
      />
    );
    expect(screen.getByText('Build better digital experiences')).toBeInTheDocument();
  });



  it('service section-test', () => {
    render(
      <Home
        {...mockHomeData}
        error={null}
      />
    );
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Rs.50000')).toBeInTheDocument();
  });


  it('err testing-api fail test', () => {
    render(
      <Home
        siteSettings={null}
        services={[]}
        blogs={[]}
        error="Failed to sync cms records"
      />
    );


    expect(
      screen.getByText('Unable to load page')
    ).toBeInTheDocument();


    expect(
      screen.getByText('Failed to sync cms records')
    ).toBeInTheDocument();

  });



  it('shows empty state when no services and blogs exist', () => {

    render(
      <Home
        siteSettings={{
          companyName: 'Test Company',
          bannerTitle: 'Welcome',
          bannerSubtitle: 'Test subtitle',
        }}
        services={[]}
        blogs={[]}
        error={null}
      />
    );


    expect(
      screen.getByText('No services available.')
    ).toBeInTheDocument();


    expect(
      screen.getByText('No blogs available.')
    ).toBeInTheDocument();

  });

});