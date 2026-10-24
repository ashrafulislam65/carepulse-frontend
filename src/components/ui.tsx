import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "danger" | "ghost" | "soft";

export function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  const styles: Record<Variant, string> = {
    primary:
      "bg-linear-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-600/35",
    danger:
      "bg-linear-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-600/35",
    ghost: "border border-slate-200 bg-white text-slate-800 shadow-xs hover:border-slate-300 hover:bg-slate-50",
    soft: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        styles[variant],
        className
      )}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700";

export function Input({
  label,
  icon,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-700">{label}</span>
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}
        <input {...props} className={cn(fieldClass, icon && "pl-10", className)} />
      </span>
    </label>
  );
}

export function Select({
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-700">{label}</span>
      <select {...props} className={cn(fieldClass, className)}>
        {children}
      </select>
    </label>
  );
}

export function Card({
  title,
  children,
  className,
  hover = false,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5",
        hover && "transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/10",
        className
      )}
    >
      {title && <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">{title}</h2>}
      {children}
    </section>
  );
}

export function Alert({
  type = "error",
  children,
}: {
  type?: "error" | "success" | "info";
  children?: ReactNode;
}) {
  if (!children) return null;
  const map = {
    error: { cls: "border-rose-200 bg-rose-50 text-rose-700", Icon: CircleAlert },
    success: { cls: "border-emerald-200 bg-emerald-50 text-emerald-700", Icon: CircleCheck },
    info: { cls: "border-brand-200 bg-brand-50 text-brand-700", Icon: Info },
  }[type];
  return (
    <div className={cn("flex animate-fade-up items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm", map.cls)}>
      <map.Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function Badge({
  tone = "brand",
  children,
}: {
  tone?: "brand" | "red" | "green" | "amber" | "slate";
  children: ReactNode;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", tones[tone])}>
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-600/25 [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}