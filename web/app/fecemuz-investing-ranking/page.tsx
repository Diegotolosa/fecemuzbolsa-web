import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type RankingItem = {
  club: string;
  status: string;
  return_ytd: number | null;
  asof_date: string | null;
};

type RankingResponse = {
  name: string;
  year: number;
  generated_at: string;
  items: RankingItem[];
};

function formatPct(v: number | null) {
  if (v === null || v === undefined) return "—";
  return `${v.toFixed(2)}%`;
}

export default async function FecemuzInvestingRankingPage({
  searchParams,
}: {
  searchParams?: { year?: string };
}) {
  // 🔒 INTERRUPTOR (robusto):
  // - Si NO existe RANKING_ENABLED en producción → 404
  // - Solo se muestra si es exactamente "true"
  const enabled = process.env.RANKING_ENABLED?.trim() === "true";
  if (!enabled) notFound();

  const year = Number(searchParams?.year || new Date().getFullYear());
  const base = process.env.RANKING_API_BASE_URL || "http://127.0.0.1:8000";

  const res = await fetch(`${base}/ranking?year=${year}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">FECEMUZ Investing Ranking</h1>
        <p className="mt-4 text-sm text-gray-600">
          No se pudo cargar el ranking (HTTP {res.status}).
        </p>
      </main>
    );
  }

  const data = (await res.json()) as RankingResponse;

  const items = data.items ?? [];
  const leader = items.find((x) => typeof x.return_ytd === "number") || null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">FECEMUZ Investing Ranking</h1>
        <p className="text-sm text-gray-600">
          Ranking de rentabilidad {year} (YTD). Actualización:{" "}
          {new Date(data.generated_at).toLocaleString()}.
        </p>
      </div>

      {/* Cards */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Líder actual</p>
          <p className="mt-2 text-xl font-semibold">{leader?.club ?? "—"}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Rentabilidad líder</p>
          <p className="mt-2 text-xl font-semibold">
            {formatPct(leader?.return_ytd ?? null)}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Clubes inscritos</p>
          <p className="mt-2 text-xl font-semibold">{items.length}</p>
        </div>
      </section>

      {/* Tabla */}
      <section className="mt-8 rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Ranking</h2>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-10 text-sm text-gray-600">
            Aún no hay clubes inscritos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-600">
                <tr className="border-b">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Club</th>
                  <th className="px-5 py-3">YTD</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">As of</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .slice()
                  .sort(
                    (a, b) =>
                      (b.return_ytd ?? -Infinity) -
                      (a.return_ytd ?? -Infinity)
                  )
                  .map((row, idx) => (
                    <tr
                      key={`${row.club}-${idx}`}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-5 py-3">{idx + 1}</td>
                      <td className="px-5 py-3 font-medium">{row.club}</td>
                      <td className="px-5 py-3">{formatPct(row.return_ytd)}</td>
                      <td className="px-5 py-3">{row.status}</td>
                      <td className="px-5 py-3">{row.asof_date ?? "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
