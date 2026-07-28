import Link from "next/link";
import { COPY } from "@/constants/copy";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="max-w-[720px] mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-semibold text-base tracking-tight hover:text-[#D4AF37] transition-colors duration-150"
        >
          {COPY.brand}
        </Link>
      </div>
    </header>
  );
}
