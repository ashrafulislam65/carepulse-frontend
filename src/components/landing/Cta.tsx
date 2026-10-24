"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/roles";
import Reveal from "../Reveal";

export default function Cta() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-indigo-600 to-violet-700 px-8 py-16 text-center shadow-2xl shadow-brand-700/30 sm:px-16">
          <div className="absolute -top-20 -left-20 -z-10 h-72 w-72 animate-blob rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-16 -bottom-24 -z-10 h-72 w-72 animate-blob rounded-full bg-rose-400/30 blur-3xl [animation-delay:-8s]" />
          <div className="absolute inset-0 -z-10 bg-grid opacity-20 invert" />

          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Be ready before the emergency happens.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Create your emergency profile in minutes and let your QR code speak for you when you cannot.
          </p>
          <Link
            href={user ? homeFor(user.role) : "/register"}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-700 shadow-xl transition hover:-translate-y-0.5"
          >
            {user ? "Go to dashboard" : "Create free account"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}