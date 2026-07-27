import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import PalmUploader from "@/components/upload/PalmUploader";
import { COPY } from "@/constants/copy";

export const metadata: Metadata = {
  title: "Upload Your Palm | astrologer.ai",
};

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-28">
        <div className="w-full max-w-[480px] mx-auto">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {COPY.upload.heading}
            </h1>
            <p className="text-[#A5A8C3] text-base leading-relaxed">
              {COPY.upload.subheading}
            </p>
          </div>

          <PalmUploader />
        </div>
      </main>
    </>
  );
}
