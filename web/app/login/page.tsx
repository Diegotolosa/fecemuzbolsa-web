"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/container";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    router.push("/socios");
  }

  return (
    <main className="py-14">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Iniciar sesión
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Acceso reservado para socios autorizados.
        </p>

        <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {msg && <p className="text-sm text-red-600">{msg}</p>}
        </form>
      </Container>
    </main>
  );
}

