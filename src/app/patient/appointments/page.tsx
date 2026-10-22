"use client";

import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card, Input, Select } from "@/components/ui";
import { api, downloadFile, errMsg } from "@/lib/api";

type Doctor = { id: string; fullName: string; specialty: string; consultationFee: number };
type Slot = { time: string; available: boolean };
type Appt = {
  id: string;
  scheduledAt: string;
  status: string;
  paymentStatus: string;
  amount: number;
  doctor: { fullName: string; specialty: string };
};
type Queue = { position: number | null; patientsAhead?: number; estimatedWaitMinutes?: number; status: string };

const today = () => new Date().toISOString().slice(0, 10);

function Appointments() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [queues, setQueues] = useState<Record<string, Queue>>({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const loadAppts = useCallback(async () => {
    try {
      setAppts(await api<Appt[]>("/appointments/mine"));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, []);

  const loadSlots = useCallback(async () => {
    if (!doctorId || !date) return setSlots([]);
    try {
      setSlots(await api<Slot[]>(`/appointments/doctors/${doctorId}/slots?date=${date}`, { auth: false }));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, [doctorId, date]);

  useEffect(() => {
    api<Doctor[]>("/appointments/doctors", { auth: false })
      .then((d) => {
        setDoctors(d);
        if (d[0]) setDoctorId(d[0].id);
      })
      .catch((e) => setErr(errMsg(e)));
    loadAppts();
  }, [loadAppts]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const run = async (fn: () => Promise<unknown>, success?: string) => {
    setMsg("");
    setErr("");
    try {
      await fn();
      if (success) setMsg(success);
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const book = (time: string) =>
    run(async () => {
      await api("/appointments", { method: "POST", body: { doctorId, scheduledAt: time } });
      await Promise.all([loadSlots(), loadAppts()]);
    }, "Appointment booked. Ekhon payment koro.");

  const cancel = (id: string) =>
    run(async () => {
      await api(`/appointments/${id}/cancel`, { method: "PATCH" });
      await Promise.all([loadSlots(), loadAppts()]);
    }, "Appointment cancelled");

  const queue = (id: string) =>
    run(async () => {
      const q = await api<Queue>(`/appointments/${id}/queue`);
      setQueues((p) => ({ ...p, [id]: q }));
    });

  const pay = (id: string) =>
    run(async () => {
      const d = await api<{ url: string }>(`/payments/checkout/${id}`, { method: "POST" });
      window.location.href = d.url;
    });

  const invoice = (id: string) => run(() => downloadFile(`/payments/invoice/${id}`, `invoice-${id}.pdf`));

  return (
    <div className="space-y-4">
      <Alert type="success">{msg}</Alert>
      <Alert>{err}</Alert>

      <Card title="Book an appointment">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName} - {d.specialty} ({d.consultationFee})
              </option>
            ))}
          </Select>
          <Input label="Date" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {slots.map((s) => (
            <button
              key={s.time}
              disabled={!s.available}
              onClick={() => book(s.time)}
              className="rounded-lg border px-3 py-1 text-sm enabled:hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              {new Date(s.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </button>
          ))}
          {slots.length === 0 && <p className="text-sm text-gray-500">Doctor ar date select koro</p>}
        </div>
      </Card>

      <Card title="My appointments">
        {appts.length === 0 && <p className="text-gray-500">No appointments</p>}
        <ul className="divide-y">
          {appts.map((a) => (
            <li key={a.id} className="py-3 text-sm">
              <p>
                <b>{a.doctor.fullName}</b> ({a.doctor.specialty}) - {new Date(a.scheduledAt).toLocaleString()}
              </p>
              <p className="text-gray-600">
                {a.status} | Payment: {a.paymentStatus} | Amount: {a.amount}
              </p>
              {queues[a.id] && (
                <p className="text-blue-700">
                  {queues[a.id].position
                    ? `Position #${queues[a.id].position}, ahead: ${queues[a.id].patientsAhead}, est. wait: ${queues[a.id].estimatedWaitMinutes} min`
                    : `Queue not active (${queues[a.id].status})`}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {a.status === "SCHEDULED" && (
                  <>
                    <Button variant="ghost" onClick={() => queue(a.id)}>
                      Queue status
                    </Button>
                    {a.paymentStatus !== "PAID" && <Button onClick={() => pay(a.id)}>Pay now</Button>}
                    <Button variant="danger" onClick={() => cancel(a.id)}>
                      Cancel
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={() => invoice(a.id)}>
                  Invoice PDF
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <RequireAuth roles={["PATIENT"]}>
      <Appointments />
    </RequireAuth>
  );
}