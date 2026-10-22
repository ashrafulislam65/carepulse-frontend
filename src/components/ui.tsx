import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "danger" | "ghost" }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100",
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function Input({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
      />
    </label>
  );
}

export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <select
        {...props}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
      >
        {children}
      </select>
    </label>
  );
}

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
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
  const styles = {
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  }[type];
  return <div className={`rounded-lg border px-3 py-2 text-sm ${styles}`}>{children}</div>;
}