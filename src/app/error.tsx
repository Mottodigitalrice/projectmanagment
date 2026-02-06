"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 font-mono text-6xl font-bold text-red-400/80">
          ERR
        </div>
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="font-mono text-sm text-red-400">
            &gt; SYSTEM_FAULT: Unexpected runtime exception
          </p>
        </div>
        <h1 className="font-mono text-xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. The system will attempt recovery.
        </p>
        <Button
          onClick={reset}
          className="mt-6 gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200 font-mono"
        >
          &gt; retry
        </Button>
      </div>
    </div>
  );
}
