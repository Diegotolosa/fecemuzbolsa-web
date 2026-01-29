"use client";

import { useMemo, useState } from "react";

export default function UploadInformeClient() {
  const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_UPLOAD_PASSWORD;

  const [password, setPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const unlocked = useMemo(() => {
    if (!expectedPassword) return true;
    return password === expectedPassword;
  }, [password, expectedPassword]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        throw new Error("Solo se admite PDF.");
      }

      const form = new FormData();
      form.append("password", password);
      form.append("file", file);

      // TU API route está en: app/api/upload-weekly-report/route.ts
      // Por tanto la URL correcta es:
      const res = await fetch("/api/upload-weekly-report", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Error ${res.status}`);
      }

      setMessage(`✅ Subido correctamente: ${data.filename ?? "OK"}`);
    } catch (err: any) {
      setMessage(`❌ ${err?.message ?? String(err)}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      {expectedPassword && (
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>
            Password (solo admin)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce la contraseña"
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
          {!unlocked && (
            <span style={{ fontSize: 12, color: "#b00020" }}>
              Contraseña incorrecta
            </span>
          )}
        </div>
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={uploading || !unlocked}
      />

      {uploading && <div>Subiendo…</div>}
      {message && <div>{message}</div>}
    </div>
  );
}

