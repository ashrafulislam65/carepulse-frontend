"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { errMsg } from "@/lib/api";
import { Alert, Button, Card, Input, Select } from "@/components/ui";

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
    <div className="mx-auto max-w-md">
      <Card title="Patient Registration">
        <form onSubmit={submit} className="space-y-3">
          <Alert>{error}</Alert>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" name="firstName" required />
            <Input label="Last name" name="lastName" required />
          </div>
          <Input label="Email" name="email" type="email" required />
          <Input label="Password (min 8)" name="password" type="password" minLength={8} required />
          <Input label="Date of birth" name="dateOfBirth" type="date" required />
          <Select label="Blood group" name="bloodGroup" defaultValue="O+">
            {GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait..." : "Create account"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-gray-600">
          Already account ache?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}