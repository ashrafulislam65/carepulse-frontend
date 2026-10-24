import CountUp from "../CountUp";
import Reveal from "../Reveal";

const stats = [
  { to: 4, suffix: "", label: "Role based portals" },
  { to: 15, suffix: " min", label: "Secure PIN unlock window" },
  { to: 3, suffix: "", label: "Nearest hospitals on SOS" },
  { to: 8, suffix: "", label: "Blood groups supported" },
];

export default function Stats() {
  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6">
      <Reveal>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="gradient-text font-display text-4xl font-extrabold">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}