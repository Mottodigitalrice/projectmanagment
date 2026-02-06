import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 font-mono text-6xl font-bold text-cyan-500/30">
          404
        </div>
        <div className="mb-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
          <p className="font-mono text-sm text-cyan-400">
            &gt; ERROR: Route not found in system registry
          </p>
        </div>
        <h1 className="font-mono text-xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button className="mt-6 gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-200 font-mono">
            &gt; return_to_dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
