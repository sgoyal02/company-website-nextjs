export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm py-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Mindfire. All rights reserved.</p>
        <p className="text-slate-500">Built with NextJs & Strapi CMS</p>
      </div>
    </footer>
  );
}