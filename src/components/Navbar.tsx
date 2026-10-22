"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/types";

const links: Record<Role, { href: string; label: string }[]> = {
  PATIENT: [
    { href: "/patient", label: "Dashboard" },
    { href: "/patient/qr", label: "My QR" },
    { href: "/patient/sos", label: "SOS" },
    { href: "/patient/records", label: "Records" },
    { href: "/patient/appointments", label: "Appointments" },
    { href: "/triage", label: "Triage" },
  ],
  DOCTOR: [{ href: "/doctor", label: "Appointments" }],
  RESPONDER: [{ href: "/responder", label: "Live Alerts" }],
  ADMIN: [{ href: "/admin", label: "Admin" }],
};

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 p-4 text-sm">
        <Link href="/" className="text-lg font-bold text-red-600">
          CarePulse
        </Link>
        {user ? (
          <>
            {links[user.role].map((l) => (
              <Link key={l.href} href={l.href} className="text-gray-700 hover:text-blue-600">
                {l.label}
              </Link>
            ))}
            <span className="ml-auto text-gray-500">
              {user.email} ({user.role})
            </span>
            <button onClick={logout} className="text-red-600 hover:underline">
              Logout
            </button>
          </>
        ) : (
          !loading && (
            <>
              <Link href="/triage" className="text-gray-700 hover:text-blue-600">
                Symptom Check
              </Link>
              <Link href="/login" className="ml-auto text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-blue-600">
                Register
              </Link>
            </>
          )
        )}
      </nav>
    </header>
  );
}