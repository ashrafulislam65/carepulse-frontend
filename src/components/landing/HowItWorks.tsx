import Reveal from "../Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "Create your profile",
    desc: "Register in a minute and add your blood group, allergies, conditions and emergency contacts.",
  },
  {
    title: "Get your secure QR",
    desc: "Save or print a signed, expiring QR code. Lost it? Revoke the old one and generate a new one instantly.",
  },
  {
    title: "Stay protected",
    desc: "Anyone can see the life-saving basics. Doctors and responders unlock the full history with login or your PIN.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative isolate scroll-mt-20 overflow-hidden bg-slate-950 py-24">
      <div className="absolute -top-32 left-1/4 -z-10 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-rose-600/20 blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20 invert [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="How it works"
          title="Set up once, protected always"
          subtitle="Three simple steps to make your medical information available exactly when it matters."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition duration-300 hover:border-white/25 hover:bg-white/10">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-brand-400 to-indigo-500 font-display text-lg font-extrabold text-white shadow-lg shadow-brand-500/30">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}