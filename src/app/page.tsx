"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/roles";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-4xl font-bold">CarePulse / MedVault</h1>
      <p className="max-w-xl text-gray-600">
        Emergency QR medical profile, live SOS dispatch, appointments and secure health records in one place.
      </p>
      <div className="flex gap-3">
        {user ? (
          <Link href={homeFor(user.role)} className="rounded-lg bg-blue-600 px-5 py-2 text-white">
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-white">
              Login
            </Link>
            <Link href="/register" className="rounded-lg border bg-white px-5 py-2">
              Register
            </Link>
          </>
        )}
        <Link href="/triage" className="rounded-lg border bg-white px-5 py-2">
          Symptom check
        </Link>
      </div>
    </div>
  );
}