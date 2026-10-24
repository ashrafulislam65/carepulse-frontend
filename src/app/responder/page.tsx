"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { Alert, Button, Card } from "@/components/ui";
import { api, errMsg, getToken, SOCKET_URL } from "@/lib/api";

type AlertItem = {
  id: string;
  status: "TRIGGERED" | "DISPATCHED";
  latitude: number;
  longitude: number;
  responderId: string | null;
  createdAt: string;
  patient: {
    firstName: string;
    lastName: string;
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    emergencyContacts: { name: string; relationship: string; phoneNumber: string }[];
  };
};

const mapLink = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`;

function Responder() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [locs, setLocs] = useState<Record<string, { lat: number; lng: number }>>({});
  const [err, setErr] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const allIds = useRef<string[]>([]);
  const myIds = useRef<string[]>([]);

  const load = useCallback(async () => {
    try {
      setAlerts(await api<AlertItem[]>("/alerts/active"));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, []);

  // socket connect + realtime events
  useEffect(() => {
    load();
    const poll = setInterval(load, 5000);
    const socket = io(SOCKET_URL, { auth: { token: getToken() } });
    socketRef.current = socket;
    socket.on("connect", () => allIds.current.forEach((id) => socket.emit("alert:join", id)));
    socket.on("alert:new", () => load());
    socket.on("alert:updated", () => load());
    socket.on("location:update", (l: { alertId: string; from: string; latitude: number; longitude: number }) => {
      if (l.from === "PATIENT") setLocs((p) => ({ ...p, [l.alertId]: { lat: l.latitude, lng: l.longitude } }));
    });
    return () => {
      socket.disconnect();
      clearInterval(poll);
    };
  }, [load]);

  // alert list change hole room join + nijer alert id gulo track
  useEffect(() => {
    allIds.current = alerts.map((a) => a.id);
    myIds.current = alerts.filter((a) => a.responderId === user?.id && a.status === "DISPATCHED").map((a) => a.id);
    allIds.current.forEach((id) => socketRef.current?.emit("alert:join", id));
  }, [alerts, user?.id]);

  // responder-er nijer live GPS patient-ke pathano
  useEffect(() => {
    if (!navigator.geolocation) return;
    const w = navigator.geolocation.watchPosition(
      (pos) =>
        myIds.current.forEach((id) =>
          socketRef.current?.emit("location:update", {
            alertId: id,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        ),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(w);
  }, []);

  const act = async (id: string, action: "accept" | "resolve") => {
    setErr("");
    try {
      await api(`/alerts/${id}/${action}`, { method: "PATCH" });
      await load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Live emergency alerts</h1>
      <Alert>{err}</Alert>
      {alerts.length === 0 && <p className="text-gray-500">Kono active alert nai.</p>}

      {alerts.map((a) => {
        const loc = locs[a.id] ?? { lat: a.latitude, lng: a.longitude };
        const mine = a.responderId === user?.id;
        return (
          <Card key={a.id} className={a.status === "TRIGGERED" ? "border-red-300" : "border-green-300"}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">
                {a.patient.firstName} {a.patient.lastName} -{" "}
                <span className="text-red-600">{a.patient.bloodGroup}</span>
              </h2>
              <span className="text-sm text-gray-500">
                {a.status} | {new Date(a.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1 text-sm">Allergies: {a.patient.allergies.join(", ") || "none"}</p>
            <p className="text-sm">Conditions: {a.patient.chronicConditions.join(", ") || "none"}</p>
            <p className="text-sm">
              Contacts: {a.patient.emergencyContacts.map((c) => `${c.name} (${c.phoneNumber})`).join(", ") || "none"}
            </p>
            <a className="mt-1 inline-block text-sm text-blue-600 underline" target="_blank" href={mapLink(loc.lat, loc.lng)}>
              Live patient location ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
            </a>
            <div className="mt-3 flex gap-2">
              {a.status === "TRIGGERED" && <Button onClick={() => act(a.id, "accept")}>Accept</Button>}
              {(mine || user?.role === "ADMIN") && a.status === "DISPATCHED" && (
                <Button variant="ghost" onClick={() => act(a.id, "resolve")}>
                  Mark resolved
                </Button>
              )}
              {a.status === "DISPATCHED" && !mine && <span className="text-sm text-gray-500">Onno responder accept korse</span>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function ResponderPage() {
  return (
    <RequireAuth roles={["RESPONDER", "ADMIN"]}>
      <Responder />
    </RequireAuth>
  );
}