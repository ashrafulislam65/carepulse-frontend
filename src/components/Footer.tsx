import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-rose-500 to-red-600 text-white">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold">
              Care<span className="text-rose-600">Pulse</span> / MedVault
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-500">
            Emergency QR medical profiles, live SOS dispatch, appointments and secure health records in one platform.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href="/#features" className="hover:text-brand-600">Features</Link></li>
            <li><Link href="/triage" className="hover:text-brand-600">Symptom check</Link></li>
            <li><Link href="/register" className="hover:text-brand-600">Create account</Link></li>
            <li><Link href="/login" className="hover:text-brand-600">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">In an emergency</h4>
          <p className="mt-3 text-sm text-slate-500">
            For a life-threatening emergency, call your local emergency number first (999 in Bangladesh).
          </p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CarePulse / MedVault. Not a substitute for professional medical advice.
      </div>
    </footer>
  );
}