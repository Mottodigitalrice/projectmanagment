"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { Home, CheckSquare, FolderOpen, Settings, Menu, X } from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: ROUTES.dashboard,
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    href: ROUTES.tasks,
  },
  {
    label: "Resources",
    icon: FolderOpen,
    href: ROUTES.resources,
  },
  {
    label: "Settings",
    icon: Settings,
    href: ROUTES.settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-cyan-500/20 px-6">
        <Link
          href={ROUTES.dashboard}
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="font-mono text-lg font-bold tracking-widest text-cyan-400">
            {APP_NAME}
          </span>
          <span className="ml-1 inline-block h-3 w-1.5 animate-glow-pulse bg-cyan-400" />
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="text-muted-foreground hover:text-foreground md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-mono transition-all duration-200",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.1)] border border-cyan-500/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
              )}
            >
              <route.icon className={cn("h-4 w-4", isActive && "drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]")} />
              {route.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-cyan-500/20 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          sys.online
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-cyan-500/20 bg-background p-2 text-cyan-400 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cyan-500/20 bg-sidebar transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r border-cyan-500/20 bg-sidebar relative z-10">
        {navContent}
      </div>
    </>
  );
}
