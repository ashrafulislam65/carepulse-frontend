"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FULL_WIDTH = ["/", "/login", "/register"];
const NO_FOOTER = ["/login", "/register"];

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const full = FULL_WIDTH.includes(path);

  return (
    <>
      <main className={full ? "flex-1" : "mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"}>{children}</main>
      {!NO_FOOTER.includes(path) && <Footer />}
    </>
  );
}