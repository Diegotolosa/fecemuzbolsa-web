import UploadInformeClient from "./upload-client";

export const dynamic = "force-dynamic";

export default function UploadInformePage() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Subir informe semanal</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Sube el PDF aquí. Esto evita el error del Dashboard de Supabase.
      </p>

      <div style={{ marginTop: 20 }}>
        <UploadInformeClient />
      </div>
    </main>
  );
}
