"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card, Input, Select } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

type Hospital = { id: string; name: string; address: string; phone: string };

function Admin() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [role, setRole] = useState("DOCTOR");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setHospitals(await api<Hospital[]>("/hospitals"));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createStaff = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setMsg("");
    setErr("");
    const body: Record<string, unknown> = {
      email: f.get("email"),
      password: f.get("password"),
      role,
    };
    if (role === "DOCTOR") {
      body.fullName = f.get("fullName");
      body.specialty = f.get("specialty");
      body.licenseNumber = f.get("licenseNumber");
      if (f.get("consultationFee")) body.consultationFee = Number(f.get("consultationFee"));
    }
    try {
      await api("/admin/users", { method: "POST", body });
      form.reset();
      setMsg("Staff user created");
    } catch (e2) {
      setErr(errMsg(e2));
    }
  };

  const addHospital = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setMsg("");
    setErr("");
    try {
      await api("/hospitals", {
        method: "POST",
        body: {
          name: f.get("name"),
          address: f.get("address"),
          phone: f.get("phone"),
          latitude: Number(f.get("latitude")),
          longitude: Number(f.get("longitude")),
        },
      });
      form.reset();
      setMsg("Hospital added");
      await load();
    } catch (e2) {
      setErr(errMsg(e2));
    }
  };

  return (
    <div className="space-y-4">
      <Alert type="success">{msg}</Alert>
      <Alert>{err}</Alert>

      <Card title="Create staff user">
        <form onSubmit={createStaff} className="grid gap-3 sm:grid-cols-2">
          <Input label="Email" name="email" type="email" required />
          <Input label="Password (min 8)" name="password" type="password" minLength={8} required />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>DOCTOR</option>
            <option>RESPONDER</option>
            <option>ADMIN</option>
          </Select>
          {role === "DOCTOR" && (
            <>
              <Input label="Full name" name="fullName" required />
              <Input label="Specialty" name="specialty" required />
              <Input label="License number" name="licenseNumber" required />
              <Input label="Consultation fee" name="consultationFee" type="number" min={1} />
            </>
          )}
          <Button type="submit" className="sm:col-span-2">
            Create
          </Button>
        </form>
      </Card>

      <Card title="Hospitals">
        <ul className="mb-4 divide-y text-sm">
          {hospitals.map((h) => (
            <li key={h.id} className="py-2">
              <b>{h.name}</b> - {h.address} ({h.phone})
            </li>
          ))}
        </ul>
        <form onSubmit={addHospital} className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" name="name" required />
          <Input label="Address" name="address" required />
          <Input label="Phone" name="phone" required minLength={5} />
          <div />
          <Input label="Latitude" name="latitude" type="number" step="any" required />
          <Input label="Longitude" name="longitude" type="number" step="any" required />
          <Button type="submit" className="sm:col-span-2">
            Add hospital
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <Admin />
    </RequireAuth>
  );
}