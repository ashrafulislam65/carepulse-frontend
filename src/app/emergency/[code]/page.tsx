"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alert, Button, Card, Input } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

type Contact = { name: string; relationship: string; phoneNumber: string; isPrimary: boolean };
type PublicProfile = {
  firstName: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContacts: Contact[];
};
type FullProfile = PublicProfile & {
  lastName: string;
  dateOfBirth: string;
  medicalRecords: { id: string; title: string; description: string; createdAt: string }[];
};

const List = ({ items }: { items: string[] }) =>
  items.length ? (
    <ul className="list-disc pl-5">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">None recorded</p>
  );

export default function EmergencyPage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const staff = !!user && ["DOCTOR", "RESPONDER", "ADMIN"].includes(user.role);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [full, setFull] = useState<FullProfile | null>(null);
  const [error, setError] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    api<PublicProfile>(`/emergency/${code}`, { auth: false })
      .then(setProfile)
      .catch((e) => setError(errMsg(e)));
  }, [code]);

  const loadFull = async (unlockToken?: string) => {
    const headers = unlockToken ? { "x-unlock-token": unlockToken } : undefined;
    setFull(await api<FullProfile>(`/emergency/${code}/full`, { headers }));
  };

  const unlock = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPinError("");
    const pin = String(new FormData(e.currentTarget).get("pin"));
    try {
      const d = await api<{ unlockToken: string }>(`/emergency/${code}/unlock`, {
        method: "POST",
        body: { pin },
        auth: false,
      });
      await loadFull(d.unlockToken);
    } catch (err) {
      setPinError(errMsg(err));
    }
  };

  if (error) return <Alert>{error}</Alert>;
  if (!profile) return <p className="text-gray-500">Loading...</p>;

  const view = full ?? profile;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Emergency Medical Info</h1>

      <Card>
        <p className="text-sm text-gray-500">Patient</p>
        <p className="text-lg font-semibold">
          {view.firstName} {full?.lastName}
        </p>
        <p className="mt-2 text-sm text-gray-500">Blood group</p>
        <p className="text-4xl font-bold text-red-600">{view.bloodGroup}</p>
        {full && <p className="mt-2 text-sm text-gray-500">DOB: {new Date(full.dateOfBirth).toLocaleDateString()}</p>}
      </Card>

      <Card title="Allergies">
        <List items={view.allergies} />
      </Card>
      <Card title="Medical conditions">
        <List items={view.chronicConditions} />
      </Card>

      <Card title="Emergency contacts">
        {view.emergencyContacts.length === 0 && <p className="text-gray-500">No contacts</p>}
        {view.emergencyContacts.map((c) => (
          <a
            key={c.phoneNumber}
            href={`tel:${c.phoneNumber}`}
            className="mt-2 block rounded-lg bg-red-600 p-3 text-center text-white"
          >
            Call {c.name} ({c.relationship})
          </a>
        ))}
      </Card>

      {full ? (
        <Card title="Medical records">
          {full.medicalRecords.length === 0 && <p className="text-gray-500">No records</p>}
          <ul className="divide-y text-sm">
            {full.medicalRecords.map((r) => (
              <li key={r.id} className="py-2">
                <b>{r.title}</b> <span className="text-gray-500">({new Date(r.createdAt).toLocaleDateString()})</span>
                <p className="text-gray-600">{r.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      ) : staff ? (
        <Button className="w-full" onClick={() => loadFull().catch((e) => setPinError(errMsg(e)))}>
          Show full medical history
        </Button>
      ) : (
        <Card title="Medical personnel: unlock full history">
          <form onSubmit={unlock} className="flex items-end gap-3">
            <Input label="Emergency PIN" name="pin" type="password" inputMode="numeric" required />
            <Button type="submit">Unlock</Button>
          </form>
        </Card>
      )}
      <Alert>{pinError}</Alert>
    </div>
  );
}