"use client";

import { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, AlertCircle, CheckCircle2, X } from "lucide-react";
import { COPY } from "@/constants/copy";
import { MOCK_REPORT_ID } from "@/lib/mockData";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "selected" | "uploading" | "error";

interface ValidationError {
  message: string;
}

const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function PalmUploader() {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setError(null);

    if (rejected.length > 0) {
      const code = rejected[0]?.errors[0]?.code;
      if (code === "file-too-large") {
        setError({ message: "This image is larger than 10 MB. Please upload a smaller file." });
      } else if (code === "file-invalid-type") {
        setError({ message: "Please upload a JPG, PNG, or WEBP image." });
      } else {
        setError({ message: "Something went wrong. Please try again." });
      }
      setUploadState("error");
      return;
    }

    if (accepted.length > 0) {
      const file = accepted[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      setUploadState("selected");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    multiple: false,
  });

  const handleContinue = () => {
    setUploadState("uploading");
    // Phase 1: simulate upload delay then navigate to scan
    setTimeout(() => {
      router.push(`/scan/${MOCK_REPORT_ID}`);
    }, 800);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setUploadState("idle");
    setError(null);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-[20px] border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
          isDragActive
            ? "border-[#D4AF37] bg-[#D4AF37]/5"
            : uploadState === "selected"
            ? "border-[#35D07F]/60 bg-[#35D07F]/5"
            : uploadState === "error"
            ? "border-[#FF6B6B]/60 bg-[#FF6B6B]/5"
            : "border-[#2D355A] bg-[#11152A] hover:border-[#D4AF37]/40 hover:bg-[#11152A]"
        )}
        style={{ minHeight: 220 }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {preview ? (
            /* Selected state — show image preview */
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full"
              style={{ minHeight: 220 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Your palm"
                className="w-full h-64 object-cover rounded-[18px]"
              />
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35D07F]" />
                <span className="text-white text-xs font-medium">
                  Image selected
                </span>
              </div>
            </motion.div>
          ) : (
            /* Idle / drag state */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 p-10 text-center"
              style={{ minHeight: 220 }}
            >
              <motion.div
                className={cn(
                  "w-16 h-16 rounded-[18px] flex items-center justify-center transition-colors duration-200",
                  isDragActive
                    ? "bg-[#D4AF37]/20"
                    : "bg-[#171C33] border border-[#2D355A]"
                )}
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              >
                {isDragActive ? (
                  <ImagePlus className="w-7 h-7 text-[#D4AF37]" />
                ) : (
                  <Upload className="w-7 h-7 text-[#A5A8C3]" />
                )}
              </motion.div>

              {isDragActive ? (
                <p className="text-[#D4AF37] font-medium">
                  Drop your image here
                </p>
              ) : (
                <>
                  <p className="text-white font-medium text-base">
                    {COPY.upload.dragText}
                  </p>
                  <p className="text-[#A5A8C3] text-sm">
                    {COPY.upload.orText}
                  </p>
                  <span className="px-4 py-2 rounded-xl border border-[#2D355A] text-[#A5A8C3] text-sm hover:border-[#D4AF37]/40 hover:text-white transition-colors duration-150">
                    Browse file
                  </span>
                  <p className="text-[#A5A8C3] text-xs">{COPY.upload.formats}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20"
          >
            <AlertCircle className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
            <p className="text-[#FF6B6B] text-sm leading-relaxed">
              {error.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

        <AnimatePresence>
        {(uploadState === "selected" || uploadState === "uploading") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Button
              fullWidth
              onClick={handleContinue}
              loading={uploadState === "uploading"}
            >
              Analyze My Palm
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requirements checklist */}
      <div className="flex flex-col gap-2">
        <p className="text-[#A5A8C3] text-xs font-medium uppercase tracking-wide mb-1">
          For best results
        </p>
        {COPY.upload.requirements.map((req) => (
          <div key={req} className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
            </div>
            <span className="text-[#A5A8C3] text-sm">{req}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
