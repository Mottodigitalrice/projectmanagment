"use client";

import { APP_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-cyan-500/20 bg-background/80 px-6 backdrop-blur-sm shadow-[0_1px_10px_rgba(0,255,255,0.05)]">
      <div className="flex items-center gap-4 pl-10 md:pl-0">
        <h2 className="font-mono text-sm font-medium tracking-wider text-muted-foreground">
          <span className="text-cyan-400">&gt;</span> {APP_NAME}
          <span className="ml-1 text-cyan-500/50">_</span>
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/70">
            connected
          </span>
        </div>
      </div>
    </header>
  );
}
