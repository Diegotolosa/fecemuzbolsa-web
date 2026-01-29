"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type PriceRow = {
  date: string;
  close: number | null;
};

function fmt(v: any, d = 2) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(d);
}

export default function AssetDetailModal({
  open,
  onClose,
  symbol,
  name,
  currency,
}: {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name?: string | null;
  currency?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const chartData = useMemo(() => {
    // Recharts funciona mejor si el "close" es number y date string
    return rows
      .filter((r) => r.close !== null && r.close !== undefined)
      .map((r) => ({ date: r.date, close: Number(r.close) }));
  }, [rows]);

  const first = chartData[0]?.close;
  const last = chartData[chartData.length - 1]?.close;

  const changePct =
    first && last ? ((last - first) / first) * 100 : null;

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      setErr(null);

      // asset_prices_daily suele tener: date, symbol, close
      const { data, error } = await supabaseBrowser
        .from("asset_prices_daily")
        .select("date,close")
        .eq("symbol", symbol)
        .order("date", { ascending: true })
        .limit(4000);

      if (error) {
        setErr(error.message);
        setRows([]);
        setLoading(false);
        return;
      }

      setRows((data as any) ?? []);
      setLoading(false);
    })();
  }, [open, symbol]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {symbol} {name ? <span className="font-normal text-slate-500">— {name}</span> : null}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Evolución diaria (cierre). {currency ? `Divisa: ${currency}` : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="p-6">
          {err && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <MiniStat label="Último cierre" value={last ? fmt(last) : "—"} />
            <MiniStat label="Primer dato" value={first ? fmt(first) : "—"} />
            <MiniStat label="Cambio total" value={changePct === null ? "—" : `${fmt(changePct)}%`} />
          </div>

          <div className="mt-6 h-[380px] rounded-2xl border border-slate-200 bg-white p-3">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-600">
                Cargando precios…
              </div>
            ) : chartData.length < 2 ? (
              <div className="flex h-full items-center justify-center text-slate-600">
                No hay suficientes datos en <code className="mx-1 rounded bg-slate-100 px-2 py-1">asset_prices_daily</code>.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
                  <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Datos con actualización diaria. Contenido educativo/divulgativo; no constituye recomendación de inversión.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
