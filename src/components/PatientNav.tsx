"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { CalendarCheck, FileText, LayoutDashboard, QrCode, Siren, Stethoscope } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/patient", label: "Overview", icon: LayoutDashboard },
  { href: "/patient/qr", label: "My QR", icon: QrCode },
  { href: "/patient/sos", label: "SOS", icon: Siren },
  { href: "/patient/records", label: "Records", icon: FileText },
  { href: "/patient/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/triage", label: "Symptom check", icon: Stethoscope },
];

export default function PatientNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              active ? "text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {active && (
              <motion.span
                layoutId="patient-pill"
                className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-600/30"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={cn("relative h-4 w-4", !active && href === "/patient/sos" && "text-rose-500")} />
            <span className="relative">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}