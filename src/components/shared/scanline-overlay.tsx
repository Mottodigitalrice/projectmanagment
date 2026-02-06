"use client";

export function ScanlineOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scanline" />
    </div>
  );
}
