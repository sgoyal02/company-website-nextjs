import { SiteSetting } from "@/types";
import Link from "next/link";

export default function Footer({settings}: {settings?:SiteSetting|null }) {
  return (
    <footer className="footer py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <p className="text-slate-400 mt-1 text-sm">
              {settings?.footerText || "All rights reserved."}
            </p>
          </div>
          <Link href={"https://www.mindfiresolutions.com/privacy-policy/"} 
          className="text-slate-400 text-sm hover:underline hover:text-primary transition-colors">
          Privacy policy 
          </Link>
        </div>
      </div>
    </footer>
  );
}