"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchReport, ApiError } from "@/lib/api";
import type { FullReport } from "@/types/report";
import { ReportCover, FullReportBody } from "@/components/report/ReportComponents";
import Button from "@/components/ui/Button";

type PageState = "loading" | "ready" | "error" | "unpaid";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [fullReport, setFullReport] = useState<FullReport | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      router.replace("/upload");
      return;
    }

    fetchReport(reportId)
      .then((data) => {
        if (data.paymentStatus === "pending") {
          setPageState("unpaid");
          return;
        }
        if (!data.report) {
          throw new Error("Report data is missing.");
        }
        setFullReport(data.report);
        setPageState("ready");
      })
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : "Failed to load your report. Please try again.";
        setLoadError(message);
        setPageState("error");
      });
  }, [reportId, router]);

  if (pageState === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          <p className="text-[#A5A8C3] text-sm">Loading your report...</p>
        </div>
      </main>
    );
  }

  if (pageState === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-[400px] text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#FF6B6B]" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold mb-2">Could Not Load Report</h2>
            <p className="text-[#A5A8C3] text-base">{loadError}</p>
          </div>
          <Button onClick={() => router.push("/upload")}>Upload New Palm</Button>
        </div>
      </main>
    );
  }

  if (pageState === "unpaid") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-[400px] text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold mb-2">Payment Required</h2>
            <p className="text-[#A5A8C3] text-base">
              This report requires payment to unlock. Please complete your purchase to access the
              full reading.
            </p>
          </div>
          <Button onClick={() => router.push(`/preview/${reportId}`)}>Go to Preview</Button>
        </div>
      </main>
    );
  }

  if (!fullReport) return null;

  const { metadata: meta, sections } = fullReport;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-28">
        <div className="max-w-[720px] mx-auto">
          <ReportCover createdAt={meta.createdAt} confidence={meta.confidence} />
          <FullReportBody sections={sections} />
        </div>
      </main>
      <Footer />
    </>
  );
}
