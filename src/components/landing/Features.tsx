import { CalendarCheck, CreditCard, FileText, QrCode, Siren, Stethoscope } from "lucide-react";
import Reveal from "../Reveal";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: QrCode,
    title: "Emergency QR profile",
    desc: "Anyone who scans sees life-saving basics. Full history opens only with a responder login or your PIN, and you can revoke the link anytime.",
    tone: "from-rose-500 to-red-600",
  },
  {
    icon: Siren,
    title: "Live SOS dispatch",
    desc: "One tap shares your live location with responders and emergency contacts, and shows the nearest hospitals.",
    tone: "from-orange-500 to-rose-600",
  },
  {
    icon: FileText,
    title: "Secure records vault",
    desc: "Upload prescriptions and lab reports straight to private cloud storage using short-lived signed links.",
    tone: "from-brand-500 to-indigo-600",
  },
  {
    icon: Stethoscope,
    title: "Symptom triage",
    desc: "Describe your symptoms and get an urgency level with a clear next step, from home care to the ER.",
    tone: "from-emerald-500 to-teal-600",
  },
  {
    icon: CalendarCheck,
    title: "Smart appointments",
    desc: "Conflict-free slot booking and a live queue position so you spend less time waiting.",
    tone: "from-violet-500 to-purple-600",
  },
  {
    icon: CreditCard,
    title: "Payments and invoices",
    desc: "Pay consultation fees online and download itemised PDF invoices whenever you need them.",
    tone: "from-sky-500 to-cyan-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need before, during and after an emergency"
        subtitle="One connected platform for patients, doctors, responders and administrators."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.1}>
            <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10">
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${f.tone} text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}