"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Droplet, MapPin, Phone, QrCode, ShieldCheck, Siren, Sparkles, Activity, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/roles";

const trust = [
  { icon: Lock, text: "PIN protected history" },
  { icon: Activity, text: "Live SOS tracking" },
  { icon: ShieldCheck, text: "Role based access" },
];

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50 via-white to-slate-50" />
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-24 -left-24 -z-10 h-96 w-96 animate-blob rounded-full bg-brand-400/30 blur-3xl" />
      <div className="absolute top-40 -right-24 -z-10 h-96 w-96 animate-blob rounded-full bg-rose-300/30 blur-3xl [animation-delay:-6s]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-28 sm:px-6 lg:grid-cols-2 lg:pt-24 lg:pb-32">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-xs backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Emergency-ready health records
          </span>

          <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your medical identity,{" "}
            <span className="gradient-text">ready when every second counts.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Share life-saving information with one QR scan, call for help with a single tap, and keep your records,
            appointments and payments in one secure place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link
                href={homeFor(user.role)}
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5"
              >
                Go to dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5"
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            )}
            <Link
              href="/triage"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Sparkles className="h-4 w-4 text-brand-600" />
              Try symptom check
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand-600" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Product preview (sample data) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-linear-to-tr from-brand-500/30 via-indigo-400/20 to-rose-400/30 blur-2xl" />

          <div className="relative animate-float rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-brand-900/10 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-linear-to-br from-brand-500 to-indigo-600 text-lg font-bold text-white">
                  R
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Rahim U.</p>
                  <p className="text-xs text-slate-500">Emergency profile</p>
                </div>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-xl border bg-white text-slate-800">
                <QrCode className="h-7 w-7" />
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-linear-to-r from-rose-50 to-red-50 p-4 ring-1 ring-rose-100">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-rose-600 text-white">
                <Droplet className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-medium text-rose-700">Blood group</p>
                <p className="text-3xl leading-none font-extrabold text-rose-600">O+</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {["Penicillin", "Peanuts"].map((a) => (
                    <span key={a} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">Conditions</p>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                  Asthma
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-red-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/30">
              <Phone className="h-4 w-4" />
              Call Karim (Brother)
            </div>
          </div>

          <div className="absolute -top-6 -right-4 hidden animate-float items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:flex [animation-delay:-3s]">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600">
              <span className="absolute inset-0 animate-ping rounded-xl bg-rose-300/50" />
              <Siren className="relative h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">SOS dispatched</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" /> Responder on the way
              </p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden animate-float items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:flex [animation-delay:-1.5s]">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">PIN unlocked</p>
              <p className="text-xs text-slate-500">Full history for 15 min</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}