import Link from "next/link";
import { COPY } from "@/constants/copy";

export default function Footer() {
  return (
    <footer className="border-t border-[#2D355A] py-8 px-6">
      <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[#A5A8C3] text-sm">{COPY.footer.copyright}</p>
        <nav className="flex items-center gap-6">
          {COPY.footer.links.map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-[#A5A8C3] text-sm hover:text-white transition-colors duration-150"
            >
              {link}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
