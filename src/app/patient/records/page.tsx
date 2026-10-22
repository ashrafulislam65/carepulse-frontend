"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Alert, Button, Card, Input } from "@/components/ui";
import { api, errMsg } from "@/lib/api";

type Rec = { id: string; title: string; description: string; createdAt: string };

function Records() {
  const [records, setRecords] = useState<Rec[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setRecords(await api<Rec[]>("/records"));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File;
    setMsg("");
    setErr("");
    if (!file || !file.size) return setErr("File select koro");
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      return setErr("Shudhu PDF, JPG ba PNG");
    }
    setBusy(true);
    try {
      const { uploadUrl, key } = await api<{ uploadUrl: string; key: string }>("/records/upload-url", {
        method: "POST",
        body: { fileName: file.name, contentType: file.type },
      });
      const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("S3 upload failed (bucket CORS check koro)");
      await api("/records", {
        method: "POST",
        body: { key, title: String(f.get("title")), description: String(f.get("description") ?? "") },
      });
      form.reset();
      setMsg("Record uploaded");
      await load();
    } catch (e2) {
      setErr(errMsg(e2));
    } finally {
      setBusy(false);
    }
  };

  const download = async (id: string) => {
    try {
      const d = await api<{ downloadUrl: string }>(`/records/${id}/download-url`);
      window.open(d.downloadUrl, "_blank");
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    try {
      await api(`/records/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <div className="space-y-4">
      <Alert type="success">{msg}</Alert>
      <Alert>{err}</Alert>

      <Card title="Upload medical record">
        <form onSubmit={upload} className="space-y-3">
          <Input label="Title" name="title" required />
          <Input label="Description" name="description" />
          <Input label="File (PDF / JPG / PNG)" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
          <Button type="submit" disabled={busy}>
            {busy ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </Card>

      <Card title="My records">
        {records.length === 0 && <p className="text-gray-500">No records</p>}
        <ul className="divide-y">
          {records.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                <b>{r.title}</b> <span className="text-gray-500">({new Date(r.createdAt).toLocaleDateString()})</span>
                <br />
                <span className="text-gray-600">{r.description}</span>
              </span>
              <span className="flex gap-2">
                <Button variant="ghost" onClick={() => download(r.id)}>
                  Open
                </Button>
                <Button variant="danger" onClick={() => remove(r.id)}>
                  Delete
                </Button>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default function RecordsPage() {
  return (
    <RequireAuth roles={["PATIENT"]}>
      <Records />
    </RequireAuth>
  );
}