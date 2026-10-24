"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Calendar, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { errMsg } from "@/lib/api";
import AuthShell from "@/components/AuthShell";
import { Alert, Button, Input, Select } from "@/components/ui";

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    setBusy(true);
    try {
      await register({
        email: String(f.get("email")),
        password: String(f.get("password")),
        firstName: String(f.get("firstName")),
        lastName: String(f.get("lastName")),
        dateOfBirth: String(f.get("dateOfBirth")),
        bloodGroup: String(f.get("bloodGroup")),
      });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your emergency profile in a minute."
      footer={
        <>
          Already account ache?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" name="firstName" icon={<User />} required />
          <Input label="Last name" name="lastName" required />
        </div>
        <Input label="Email" name="email" type="email" icon={<Mail />} placeholder="you@example.com" required />
        <Input label="Password (min 8)" name="password" type="password" icon={<Lock />} minLength={8} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date of birth" name="dateOfBirth" type="date" icon={<Calendar />} required />
          <Select label="Blood group" name="bloodGroup" defaultValue="O+">
            {GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
        </div>
        <Button type="submit" loading={busy} className="w-full py-3">
          {busy ? "Please wait..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}