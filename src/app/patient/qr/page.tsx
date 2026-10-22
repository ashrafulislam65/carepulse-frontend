"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

type Qr = { token: string; url: string; qrDataUrl: string; expiresIn: string };

function QrView() {
  const [qr, setQr] = useState<Qr | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api<Qr>("/patients/me/qr").then(setQr).catch((e) => setErr(errMsg(e)));
  }, []);

  const revoke = async () => {
    if (!confirm("Purono QR bondho hoye jabe. Continue?")) return;
    try {
      const d = await api<Qr>("/patients/me/qr/revoke", { method: "POST" });
      setQr(d);
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <Card title="My Emergency QR" className="mx-auto max-w-md text-center">
      <Alert>{err}</Alert>
      {qr && (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr.qrDataUrl} alt="Emergency QR" className="mx-auto h-64 w-64" />
          <p className="break-all text-xs text-gray-500">{qr.url}</p>
          <p className="text-sm text-gray-600">Valid for: {qr.expiresIn}</p>
          <div className="flex justify-center gap-2">
            <a href={qr.qrDataUrl} download="carepulse-qr.png" className="rounded-lg border px-4 py-2 text-sm">
              Download
            </a>
            <Button variant="danger" onClick={revoke}>
              Revoke and regenerate
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function QrPage() {
  return (
    <RequireAuth roles={["PATIENT"]}>
      <QrView />
    </RequireAuth>
  );
}