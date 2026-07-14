import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('footer com- tests', () => {
  it('footer text render- test', () => {
    render(<Footer settings={{ footerText: '@ 2026 Test Comp', companyName: 'Test Comp' }} />);
    expect(screen.getByText('@ 2026 Test Comp')).toBeInTheDocument();
  });

  it('deafult text on settings miss- test', () => {
    render(<Footer />);
    expect(screen.getByText('All rights reserved.')).toBeInTheDocument();
  });

  it('policy link- test', () => {
    render(<Footer />);
    const linkData = screen.getByText('Privacy policy');
    expect(linkData).toHaveAttribute('href', expect.stringContaining('privacy-policy'));
  });
});
