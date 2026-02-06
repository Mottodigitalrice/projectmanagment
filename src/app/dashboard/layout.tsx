import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { UserSync } from "@/components/shared/user-sync";
import { ScanlineOverlay } from "@/components/shared/scanline-overlay";
import { GridBackground } from "@/components/shared/grid-background";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <UserSync />
      <ScanlineOverlay />
      <GridBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col relative z-10">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
