"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { errMsg } from "@/lib/api";
import { Alert, Button, Card, Input } from "@/components/ui";

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
    <div className="mx-auto max-w-sm">
      <Card title="Login">
        <form onSubmit={submit} className="space-y-3">
          <Alert>{error}</Alert>
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait..." : "Login"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-gray-600">
          Account nai?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Test: doctor@ / responder@ / admin@carepulse.test, password: Password@123
        </p>
      </Card>
    </div>
  );
}