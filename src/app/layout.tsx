import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkClientProvider } from "@/components/providers/clerk-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEXUS | Space Terminal Project Manager",
  description: "Space Terminal Project Manager — Built by Mottodigital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClerkClientProvider>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ClerkClientProvider>
      </body>
    </html>
  );
}
