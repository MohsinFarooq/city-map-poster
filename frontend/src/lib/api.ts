import axios from "axios";
import type { PosterConfig } from "@/features/poster/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // short — we're just submitting jobs and polling, not waiting for generation
});

// Submit job — returns job_id immediately
export async function submitPosterJob(config: PosterConfig): Promise<string> {
  const { data } = await api.post<{ job_id: string }>(
    "/posters/generate",
    config
  );
  return data.job_id;
}

// Poll job status
export type JobStatus =
  | { state: "pending" | "progress"; step?: string }
  | { state: "success"; filename: string; download_url: string }
  | { state: "failure"; error: string };

export async function getPosterJobStatus(jobId: string): Promise<JobStatus> {
  const { data } = await api.get<JobStatus>(`/posters/status/${jobId}`);
  return data;
}

export function getPosterDownloadUrl(downloadUrl: string): string {
  // If already absolute URL (Cloudinary), return as-is
  if (downloadUrl.startsWith("http")) {
    return downloadUrl;
  }
  return `${SERVER_BASE}${downloadUrl}`;
}

export function getPosterImageUrl(downloadUrl: string): string {
  if (downloadUrl.startsWith("http")) {
    return downloadUrl;
  }
  return `${SERVER_BASE}${downloadUrl}`;
}
