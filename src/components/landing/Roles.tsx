import { Check, ShieldCheck, Siren, Stethoscope, User } from "lucide-react";
import Reveal from "../Reveal";
import SectionHeading from "./SectionHeading";

const roles = [
  {
    icon: User,
    name: "Patient",
    tone: "from-brand-500 to-indigo-600",
    points: ["Medical profile and emergency contacts", "QR code with PIN protection", "SOS, records and appointments"],
  },
  {
    icon: Stethoscope,
    name: "Doctor",
    tone: "from-emerald-500 to-teal-600",
    points: ["Your appointment schedule", "Records of your own patients", "Mark consultations completed"],
  },
  {
    icon: Siren,
    name: "Responder",
    tone: "from-rose-500 to-red-600",
    points: ["Live emergency alerts", "Accept and resolve cases", "Patient medical basics and location"],
  },
  {
    icon: ShieldCheck,
    name: "Admin",
    tone: "from-violet-500 to-purple-600",
    points: ["Create doctor and responder accounts", "Manage partner hospitals", "Platform oversight"],
  },
];

export default function Roles() {
  return (
    <section id="roles" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Built for every role"
        title="The right tools for everyone involved"
        subtitle="Strict role based access keeps each person focused on what they need and nothing more."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-600/10">
              <span className={`grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${r.tone} text-white shadow-lg`}>
                <r.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{r.name}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}