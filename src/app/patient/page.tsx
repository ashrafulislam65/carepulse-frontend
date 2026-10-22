"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card, Input, Select } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type Contact = { id: string; name: string; relationship: string; phoneNumber: string; isPrimary: boolean };
type Me = {
  firstName: string;
  lastName: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  hasEmergencyPin: boolean;
  emergencyContacts: Contact[];
};

const toList = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function Dashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setMe(await api<Me>("/patients/me"));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn: () => Promise<unknown>, success: string) => {
    setMsg("");
    setErr("");
    try {
      await fn();
      setMsg(success);
      await load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(
      () =>
        api("/patients/me", {
          method: "PATCH",
          body: {
            firstName: f.get("firstName"),
            lastName: f.get("lastName"),
            bloodGroup: f.get("bloodGroup"),
            allergies: toList(f.get("allergies")),
            chronicConditions: toList(f.get("chronicConditions")),
          },
        }),
      "Profile updated"
    );
  };

  const addContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    run(async () => {
      await api("/patients/me/contacts", {
        method: "POST",
        body: {
          name: f.get("name"),
          relationship: f.get("relationship"),
          phoneNumber: f.get("phoneNumber"),
          isPrimary: f.get("isPrimary") === "on",
        },
      });
      form.reset();
    }, "Contact added");
  };

  const setPin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const pin = String(new FormData(form).get("pin"));
    run(async () => {
      await api("/patients/me/pin", { method: "PUT", body: { pin } });
      form.reset();
    }, "Emergency PIN saved");
  };

  if (!me) return <p className="text-gray-500">{err || "Loading..."}</p>;

  return (
    <div className="space-y-4">
      <Alert type="success">{msg}</Alert>
      <Alert>{err}</Alert>

      <Card title="Medical profile">
        <form key={JSON.stringify(me)} onSubmit={saveProfile} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" name="firstName" defaultValue={me.firstName} required />
            <Input label="Last name" name="lastName" defaultValue={me.lastName} required />
          </div>
          <Select label="Blood group" name="bloodGroup" defaultValue={me.bloodGroup}>
            {GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
          <Input label="Allergies (comma separated)" name="allergies" defaultValue={me.allergies.join(", ")} />
          <Input
            label="Medical conditions (comma separated)"
            name="chronicConditions"
            defaultValue={me.chronicConditions.join(", ")}
          />
          <Button type="submit">Save profile</Button>
        </form>
      </Card>

      <Card title="Emergency contacts">
        <ul className="mb-4 divide-y">
          {me.emergencyContacts.length === 0 && <li className="py-2 text-gray-500">No contact yet</li>}
          {me.emergencyContacts.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                {c.name} ({c.relationship}) - {c.phoneNumber}
                {c.isPrimary && <b className="ml-2 text-green-600">Primary</b>}
              </span>
              <Button
                variant="danger"
                onClick={() => run(() => api(`/patients/me/contacts/${c.id}`, { method: "DELETE" }), "Contact deleted")}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <form onSubmit={addContact} className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" name="name" required />
          <Input label="Relationship" name="relationship" required />
          <Input label="Phone (+8801...)" name="phoneNumber" required minLength={6} />
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input type="checkbox" name="isPrimary" /> Primary contact
          </label>
          <Button type="submit" className="sm:col-span-2">
            Add contact
          </Button>
        </form>
      </Card>

      <Card title="Emergency PIN">
        <p className="mb-2 text-sm text-gray-600">
          Status: {me.hasEmergencyPin ? "PIN set" : "PIN not set"}. Ei PIN diye QR scan kore full medical history dekha jabe.
        </p>
        <form onSubmit={setPin} className="flex items-end gap-3">
          <Input label="4-6 digit PIN" name="pin" inputMode="numeric" pattern="\d{4,6}" required />
          <Button type="submit">Save PIN</Button>
        </form>
      </Card>
    </div>
  );
}

export default function PatientPage() {
  return (
    <RequireAuth roles={["PATIENT"]}>
      <Dashboard />
    </RequireAuth>
  );
}