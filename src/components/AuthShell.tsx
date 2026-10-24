import Link from "next/link";
import { ReactNode } from "react";
import { HeartPulse, QrCode, ShieldCheck, Siren } from "lucide-react";

const points = [
  { icon: QrCode, text: "Emergency QR that works without an app" },
  { icon: Siren, text: "One tap SOS with live location" },
  { icon: ShieldCheck, text: "Private records with role based access" },
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-linear-to-br from-brand-700 via-indigo-700 to-violet-800 p-12 text-white lg:flex">
        <div className="absolute -top-24 -left-24 -z-10 h-96 w-96 animate-blob rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 -z-10 h-96 w-96 animate-blob rounded-full bg-rose-400/30 blur-3xl [animation-delay:-7s]" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-20 invert" />

        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold">CarePulse</span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-4xl leading-tight font-extrabold">Healthcare that moves at the speed of emergencies.</h2>
          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-brand-50">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/60">© CarePulse / MedVault</p>
      </aside>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5">
            {children}
          </div>
          {footer && <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>}
        </div>
      </div>
    </div>
  );
}