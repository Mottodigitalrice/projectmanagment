"use client";

import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "green" | "purple";
  hoverable?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "cyan",
  hoverable = true,
}: GlowCardProps) {
  const glowClasses = {
    cyan: "shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]",
    green:
      "shadow-[0_0_15px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]",
    purple:
      "shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
  };

  const borderClasses = {
    cyan: "border-cyan-500/20 hover:border-cyan-400/40",
    green: "border-emerald-500/20 hover:border-emerald-400/40",
    purple: "border-purple-500/20 hover:border-purple-400/40",
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 transition-all duration-300",
        hoverable && glowClasses[glowColor],
        hoverable && borderClasses[glowColor],
        !hoverable && "border-border",
        className
      )}
    >
      {children}
    </div>
  );
}
