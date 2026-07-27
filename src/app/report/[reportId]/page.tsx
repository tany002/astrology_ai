import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MOCK_REPORT } from "@/lib/mockData";
import {
  ReportCover,
  FullReportBody,
} from "@/components/report/ReportComponents";

export const metadata: Metadata = {
  title: "Your Palm Reading | astrologer.ai",
};

export default function ReportPage() {
  const report = MOCK_REPORT;
  const { metadata: meta, sections } = report.fullReport;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-28">
        <div className="max-w-[720px] mx-auto">
          <ReportCover
            createdAt={meta.createdAt}
            confidence={meta.confidence}
          />
          <FullReportBody sections={sections} />
        </div>
      </main>
      <Footer />
    </>
  );
}
