"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { HeartPulse, LogOut, Menu, Siren, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/types";
import { cn } from "@/lib/cn";

type NavLink = { href: string; label: string };

const roleLinks: Record<Role, NavLink[]> = {
  PATIENT: [
    { href: "/patient", label: "Dashboard" },
    { href: "/triage", label: "Symptom Check" },
  ],
  DOCTOR: [{ href: "/doctor", label: "Appointments" }],
  RESPONDER: [{ href: "/responder", label: "Live Alerts" }],
  ADMIN: [{ href: "/admin", label: "Admin" }],
};

const publicLinks: NavLink[] = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#roles", label: "Roles" },
  { href: "/triage", label: "Symptom Check" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = user ? roleLinks[user.role] : publicLinks;
  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-slate-200/70 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-xl"
          : "border-transparent bg-white/40 backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="mr-4 flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-600/30">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
            Care<span className="text-rose-600">Pulse</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-brand-50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200/70" />
          ) : user ? (
            <>
              {user.role === "PATIENT" && (
                <Link
                  href="/patient/sos"
                  className="relative hidden items-center gap-1.5 rounded-full bg-linear-to-r from-rose-600 to-red-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-md shadow-rose-600/30 transition hover:scale-105 sm:inline-flex"
                >
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-rose-500" />
                  </span>
                  <Siren className="h-4 w-4" />
                  SOS
                </Link>
              )}
              <div className="hidden items-center gap-2 rounded-full border bg-white py-1 pr-3 pl-1 shadow-xs sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-brand-500 to-indigo-600 text-xs font-bold text-white">
                  {user.email[0].toUpperCase()}
                </span>
                <div className="leading-tight">
                  <p className="max-w-[140px] truncate text-xs font-semibold text-slate-800">{user.email}</p>
                  <p className="text-[10px] font-semibold tracking-wide text-brand-600 uppercase">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                aria-label="Logout"
                className="grid h-9 w-9 place-items-center rounded-full border bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-block"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-linear-to-r from-brand-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get started
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-full border bg-white text-slate-700 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium",
                    isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              {user?.role === "PATIENT" && (
                <Link
                  href="/patient/sos"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700"
                >
                  SOS Emergency
                </Link>
              )}
              {!user && !loading && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}