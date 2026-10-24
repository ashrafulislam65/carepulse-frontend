"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { errMsg } from "@/lib/api";
import AuthShell from "@/components/AuthShell";
import { Alert, Button, Input } from "@/components/ui";

const demo = [
  { label: "Doctor", email: "doctor@carepulse.test" },
  { label: "Responder", email: "responder@carepulse.test" },
  { label: "Admin", email: "admin@carepulse.test" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to your CarePulse account."
      footer={
        <>
          Account nai?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Input
          label="Email"
          type="email"
          required
          icon={<Mail />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          required
          icon={<Lock />}
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" loading={busy} className="w-full py-3">
          {busy ? "Please wait..." : "Login"}
        </Button>
      </form>

      <div className="mt-6 border-t pt-4">
        <p className="mb-2 text-xs font-medium text-slate-400">Demo accounts (password: Password@123)</p>
        <div className="flex flex-wrap gap-2">
          {demo.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword("Password@123");
              }}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}