import { useState, useRef } from "react";
import {
  submitPosterJob,
  getPosterJobStatus,
  getPosterDownloadUrl,
} from "@/lib/api";
import type { PosterConfig, PosterResult } from "@/features/poster/types";

type Status = "idle" | "loading" | "success" | "error";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 60; // 3s * 60 = 3 minutes max wait

export function usePosterGeneration() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PosterResult | null>(null);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<string>("Queuing job…");
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  };

  const generate = async (config: PosterConfig) => {
    setStatus("loading");
    setError("");
    setResult(null);
    setStep("Queuing job…");
    stopPolling();

    try {
      const jobId = await submitPosterJob(config);
      setStep("Fetching map data…");
      poll(jobId, 0);
    } catch (err) {
      setError(extractError(err));
      setStatus("error");
    }
  };

  const poll = (jobId: string, attempts: number) => {
    if (attempts >= MAX_POLLS) {
      setError("Timed out waiting for poster generation.");
      setStatus("error");
      return;
    }

    pollRef.current = setTimeout(async () => {
      try {
        const jobStatus = await getPosterJobStatus(jobId);

        if (jobStatus.state === "pending" || jobStatus.state === "progress") {
          setStep("Waiting for worker…");
          if (jobStatus.state === "progress" && jobStatus.step) {
            setStep(jobStatus.step);
          }
          poll(jobId, attempts + 1);
        } else if (jobStatus.state === "success") {
          setResult({
            status: "success",
            filename: jobStatus.filename,
            download_url: jobStatus.download_url,
          });
          setStatus("success");
        } else if (jobStatus.state === "failure") {
          setError(jobStatus.error ?? "Generation failed.");
          setStatus("error");
        }
      } catch (err) {
        setError(extractError(err));
        setStatus("error");
      }
    }, POLL_INTERVAL_MS);
  };

  const reset = () => {
    stopPolling();
    setStatus("idle");
    setResult(null);
    setError("");
    setStep("Queuing job…");
  };

  const download = () => {
    if (!result) return;
    const url = getPosterDownloadUrl(result.download_url);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return { status, result, error, step, generate, reset, download };
}

function extractError(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "detail" in err.response.data
  ) {
    return String((err.response.data as { detail: string }).detail);
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}
