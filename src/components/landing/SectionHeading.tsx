import Reveal from "../Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
          dark ? "bg-white/10 text-brand-200" : "bg-brand-50 text-brand-700"
        }`}
      >
        {eyebrow}
      </span>
      <h2 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-slate-900"}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-3 text-lg ${dark ? "text-slate-300" : "text-slate-600"}`}>{subtitle}</p>}
    </Reveal>
  );
}