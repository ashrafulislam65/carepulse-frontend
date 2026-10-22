"use client";

import { FormEvent, useState } from "react";
import { Alert, Button, Card, Input } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

type Result = {
  urgency: "EMERGENCY" | "URGENT" | "NON_URGENT";
  urgencyScore: number;
  matchedSymptoms: string[];
  recommendation: string;
  disclaimer: string;
};

const colors = {
  EMERGENCY: "bg-red-100 text-red-700",
  URGENT: "bg-yellow-100 text-yellow-700",
  NON_URGENT: "bg-green-100 text-green-700",
};

export default function TriagePage() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const age = String(f.get("age") ?? "");
    setError("");
    setBusy(true);
    try {
      setResult(
        await api<Result>("/triage/check", {
          method: "POST",
          auth: false,
          body: { symptoms: String(f.get("symptoms")), ...(age ? { age: Number(age) } : {}) },
        })
      );
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Card title="Symptom checker">
        <form onSubmit={submit} className="space-y-3">
          <Alert>{error}</Alert>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Symptoms (English-e lekho)</span>
            <textarea
              name="symptoms"
              required
              minLength={3}
              rows={4}
              placeholder="e.g. chest pain and shortness of breath"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>
          <Input label="Age (optional)" name="age" type="number" min={0} max={120} />
          <Button type="submit" disabled={busy}>
            {busy ? "Checking..." : "Check"}
          </Button>
        </form>
      </Card>

      {result && (
        <Card>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colors[result.urgency]}`}>
            {result.urgency.replace("_", " ")}
          </span>
          <p className="mt-3">{result.recommendation}</p>
          {result.matchedSymptoms.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">Matched: {result.matchedSymptoms.join(", ")}</p>
          )}
          <p className="mt-3 text-xs text-gray-500">{result.disclaimer}</p>
        </Card>
      )}
    </div>
  );
}