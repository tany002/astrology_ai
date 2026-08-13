import type { ReportPreview, FullReport } from "@/types/report";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(
  /\/+$/,
  ""
);

class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  let json: { success: boolean; message: string; data?: T };
  try {
    json = (await res.json()) as { success: boolean; message: string; data?: T };
  } catch {
    throw new ApiError(
      res.status === 503
        ? "Payment service is temporarily unavailable. Please try again."
        : `Request failed (${res.status}).`,
      res.status
    );
  }

  if (!json.success) {
    throw new ApiError(json.message ?? "An error occurred.", res.status);
  }

  return json.data as T;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadPalmImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const url = `${API_URL}/api/upload-palm`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const json = (await res.json()) as {
    success: boolean;
    message: string;
    data?: { imageUrl: string };
  };

  if (!json.success || !json.data?.imageUrl) {
    throw new ApiError(json.message ?? "Upload failed.", res.status);
  }

  return json.data;
}

// ─── Analyze ──────────────────────────────────────────────────────────────────

export interface AnalyzeResult {
  reportId: string;
  preview: ReportPreview;
  paymentStatus: "pending";
}

export async function analyzePalm(imageUrl: string): Promise<AnalyzeResult> {
  return request<AnalyzeResult>("/analyze", {
    method: "POST",
    body: JSON.stringify({ imageUrl }),
  });
}

// ─── Create Order ─────────────────────────────────────────────────────────────

export interface OrderResult {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export async function createPaymentOrder(
  reportId: string,
  email: string,
  phone?: string
): Promise<OrderResult> {
  return request<OrderResult>("/create-order", {
    method: "POST",
    body: JSON.stringify({ reportId, email, phone }),
  });
}

// ─── Verify Payment ───────────────────────────────────────────────────────────

export interface VerifyResult {
  paymentStatus: "paid";
  reportId: string;
}

export async function verifyPayment(payload: {
  reportId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<VerifyResult> {
  return request<VerifyResult>("/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Get Report ───────────────────────────────────────────────────────────────

export interface ReportResponse {
  reportId: string;
  paymentStatus: "pending" | "paid";
  preview?: ReportPreview;
  report?: FullReport;
  createdAt: string;
}

export async function fetchReport(reportId: string): Promise<ReportResponse> {
  return request<ReportResponse>(`/report/${reportId}`, { method: "GET" });
}

// ─── Simple Direct Payment (₹5 launch offer) ─────────────────────────────────

export interface SimpleOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export async function createSimpleOrder(params: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<SimpleOrderResult> {
  return request<SimpleOrderResult>("/simple-order", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export interface SimpleVerifyResult {
  paymentId: string;
  orderId: string;
  paymentStatus: "paid";
}

export async function verifySimplePayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<SimpleVerifyResult> {
  return request<SimpleVerifyResult>("/simple-verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { ApiError };
