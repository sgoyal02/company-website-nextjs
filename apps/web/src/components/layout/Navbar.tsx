import { STRAPI_URL } from '@/constants/CONFIG';
import { SiteSetting } from '@/types';
import Link from 'next/link';

export default function Navbar({ settings }: { settings?: SiteSetting | null }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          <div className="flex items-center gap-0.5">
            {settings?.logo?.url ? (
              <img
                src={`${STRAPI_URL}${settings.logo.url}`}
                alt={settings.companyName || 'Logo'}
                className="h-9 w-auto"
              />
            ) : (
              <div className="h-9 w-9 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
                {settings?.companyName?.charAt(0) || 'C'}
              </div>
            )}
            <span className="text-2xl font-bold text-primary tracking-tight">
              {settings?.companyName || 'Company'}
            </span>
          </div>
        </Link>

        <div className="flex gap-6 font-medium text-slate-600 text-sm">
          <Link href="/" className="hover:text-primary transition-colors hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors hover:underline">
            About
          </Link>
          <Link href="/services" className="hover:text-primary transition-colors hover:underline">
            Services
          </Link>
          <Link href="/blog" className="hover:text-primary transition-colors hover:underline">
            Blogs
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
