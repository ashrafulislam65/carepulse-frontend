"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card } from "@/components/ui";
import { api, errMsg, getToken, SOCKET_URL } from "@/lib/api";

type Hospital = { id: string; name: string; address: string; phone: string; distanceKm: number };
type AlertRes = {
  alert: { id: string; status: string };
  nearbyHospitals?: Hospital[];
};

const mapLink = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`;

function Sos() {
  const [alertId, setAlertId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [responder, setResponder] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const watchRef = useRef<number | null>(null);

  const stopTracking = () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
  };

  useEffect(() => stopTracking, []);

  const startTracking = (id: string) => {
    stopTracking();
    const socket = io(SOCKET_URL, { auth: { token: getToken() } });
    socketRef.current = socket;
    socket.on("connect", () => socket.emit("alert:join", id));
    socket.on("alert:updated", (u: { status: string }) => {
      setStatus(u.status);
      if (u.status === "RESOLVED" || u.status === "CANCELLED") stopTracking();
    });
    socket.on("location:update", (l: { from: string; latitude: number; longitude: number }) => {
      if (l.from === "RESPONDER") setResponder({ lat: l.latitude, lng: l.longitude });
    });
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) =>
        socket.emit("location:update", {
          alertId: id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: true }
    );
  };

  const trigger = () => {
    setErr("");
    if (!navigator.geolocation) return setErr("Geolocation not supported");
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const d = await api<AlertRes>("/alerts", {
            method: "POST",
            body: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          });
          setAlertId(d.alert.id);
          setStatus(d.alert.status);
          setHospitals(d.nearbyHospitals ?? []);
          startTracking(d.alert.id);
        } catch (e) {
          setErr(errMsg(e));
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setErr("Location permission dao, na hole SOS pathano jabe na");
      },
      { enableHighAccuracy: true }
    );
  };

  const cancel = async () => {
    if (!alertId) return;
    try {
      await api(`/alerts/${alertId}/cancel`, { method: "PATCH" });
      setStatus("CANCELLED");
      stopTracking();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const active = alertId && (status === "TRIGGERED" || status === "DISPATCHED");

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Alert>{err}</Alert>
      {!active ? (
        <Card className="text-center">
          <p className="mb-4 text-gray-600">Emergency hole nicher button-e chap dao. Tomar location responder ar emergency contact-der kache jabe.</p>
          <button
            onClick={trigger}
            disabled={busy}
            className="h-40 w-40 rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "..." : "SOS"}
          </button>
        </Card>
      ) : (
        <Card title="SOS active" className="border-red-300">
          <p className="mb-2">
            Status: <b className={status === "DISPATCHED" ? "text-green-600" : "text-red-600"}>{status}</b>
          </p>
          <p className="text-sm text-gray-600">
            {status === "TRIGGERED" ? "Responder-er jonno wait korchi..." : "Responder ashche."}
          </p>
          {responder && (
            <a className="mt-2 block text-blue-600 underline" target="_blank" href={mapLink(responder.lat, responder.lng)}>
              Responder-er live location dekho
            </a>
          )}
          <Button variant="ghost" className="mt-3" onClick={cancel}>
            Cancel SOS
          </Button>
        </Card>
      )}

      {!active && status && <Alert type="info">Last SOS status: {status}</Alert>}

      {hospitals.length > 0 && (
        <Card title="Nearest hospitals">
          <ul className="divide-y text-sm">
            {hospitals.map((h) => (
              <li key={h.id} className="py-2">
                <b>{h.name}</b> - {h.distanceKm} km
                <br />
                <span className="text-gray-500">{h.address}</span> <a className="text-blue-600" href={`tel:${h.phone}`}>{h.phone}</a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

export default function SosPage() {
  return (
    <RequireAuth roles={["PATIENT"]}>
      <Sos />
    </RequireAuth>
  );
}