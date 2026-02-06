import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantClasses = {
  default: "bg-muted/50 text-muted-foreground border-border",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/10 text-red-400 border-red-500/30",
  info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
};

export function StatusBadge({
  status,
  variant = "default",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {status}
    </span>
  );
}
