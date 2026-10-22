import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CarePulse / MedVault",
  description: "Unified Emergency Health Records & Smart Service Network",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-4xl p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}