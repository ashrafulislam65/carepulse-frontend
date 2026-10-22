"use client";

import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

type Appt = {
  id: string;
  scheduledAt: string;
  status: string;
  paymentStatus: string;
  patient: { id: string; firstName: string; lastName: string };
};
type Rec = { id: string; title: string; description: string; createdAt: string };

function Doctor() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [recs, setRecs] = useState<Record<string, Rec[]>>({});
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setAppts(await api<Appt[]>("/appointments/mine"));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const complete = async (id: string) => {
    try {
      await api(`/appointments/${id}/complete`, { method: "PATCH" });
      await load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const showRecords = async (patientId: string) => {
    try {
      const list = await api<Rec[]>(`/records?patientId=${patientId}`);
      setRecs((p) => ({ ...p, [patientId]: list }));
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const open = async (id: string) => {
    try {
      const d = await api<{ downloadUrl: string }>(`/records/${id}/download-url`);
      window.open(d.downloadUrl, "_blank");
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My appointments</h1>
      <Alert>{err}</Alert>
      {appts.length === 0 && <p className="text-gray-500">No appointments</p>}
      {appts.map((a) => (
        <Card key={a.id}>
          <p className="font-medium">
            {a.patient.firstName} {a.patient.lastName} - {new Date(a.scheduledAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {a.status} | Payment: {a.paymentStatus}
          </p>
          <div className="mt-2 flex gap-2">
            {a.status === "SCHEDULED" && <Button onClick={() => complete(a.id)}>Mark completed</Button>}
            <Button variant="ghost" onClick={() => showRecords(a.patient.id)}>
              Patient records
            </Button>
          </div>
          {recs[a.patient.id] && (
            <ul className="mt-3 divide-y text-sm">
              {recs[a.patient.id].length === 0 && <li className="py-1 text-gray-500">No records</li>}
              {recs[a.patient.id].map((r) => (
                <li key={r.id} className="flex items-center justify-between py-1">
                  <span>{r.title}</span>
                  <Button variant="ghost" onClick={() => open(r.id)}>
                    Open
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}

export default function DoctorPage() {
  return (
    <RequireAuth roles={["DOCTOR"]}>
      <Doctor />
    </RequireAuth>
  );
}