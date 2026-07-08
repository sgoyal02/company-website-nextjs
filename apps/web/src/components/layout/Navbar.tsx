import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          Mindfire
        </Link>
        <div className="flex gap-6 font-medium text-slate-600 text-sm">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
}