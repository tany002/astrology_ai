import type { Metadata } from "next";
import ScanAnimation from "@/components/scan/ScanAnimation";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Analyzing Your Palm | astrologer.ai",
};

export default function ScanPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-28">
        <div className="w-full text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Analyzing your palm
          </h1>
          <p className="text-[#A5A8C3] text-sm">
            This takes about 15–20 seconds. Please don&apos;t close this page.
          </p>
        </div>

        <ScanAnimation />
      </main>
    </>
  );
}
