"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/container";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Profile = { role: string | null; email: string | null };

type PortfolioSnapshot = {
  snapshot_date: string;
  nav_eur: number | null;
  pnl_total_eur: number | null;
  return_1d: number | null;
  return_ytd: number | null;
  return_itd: number | null;
  created_at: string | null;
  [k: string]: any;
};

type AnyPositionRow = { [k: string]: any };
type PriceRow = { date: string; close: number | null };

type RangeKey = "1M" | "3M" | "6M" | "YTD" | "1Y" | "MAX";

function fmt(v: any, d = 2) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(d);
}

function fmtPctSmart(v: any, d = 2) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  const pct = Math.abs(n) <= 1 ? n * 100 : n;
  return `${pct.toFixed(d)}%`;
}

function pick(row: AnyPositionRow, keys: string[]) {
  for (const k of keys) {
    if (row?.[k] !== undefined && row?.[k] !== null) return row[k];
  }
  return null;
}

function startDateForRange(range: RangeKey): string | null {
  const today = new Date();
  const d = new Date(today);

  if (range === "MAX") return null;

  if (range === "YTD") {
    d.setMonth(0, 1);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

  const months =
    range === "1M" ? 1 : range === "3M" ? 3 : range === "6M" ? 6 : 12;

  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

function startOfOperationsISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function normalizeTo100(series: Array<{ date: string; value: number }>) {
  if (!series.length) return [];
  const base = series[0].value;
  if (!base || base === 0) return series.map((r) => ({ date: r.date, idx: null as any }));
  return series.map((r) => ({ date: r.date, idx: (r.value / base) * 100 }));
}

function mean(xs: number[]) {
  if (!xs.length) return null;
  let s = 0;
  for (const x of xs) s += x;
  return s / xs.length;
}

function stdevSample(xs: number[]) {
  if (xs.length < 2) return null;
  const m = mean(xs);
  if (m === null) return null;
  let ss = 0;
  for (const x of xs) {
    const d = x - m;
    ss += d * d;
  }
  return Math.sqrt(ss / (xs.length - 1));
}

// 252 trading days annualization
function annualizedVolFromDailyReturns(dailyReturns: number[]) {
  const sd = stdevSample(dailyReturns);
  if (sd === null) return null;
  return sd * Math.sqrt(252) * 100;
}

function computeMaxDrawdown(navSeries: number[]) {
  if (navSeries.length < 2) return null;
  let peak = navSeries[0];
  let maxDD = 0;
  for (const v of navSeries) {
    if (v > peak) peak = v;
    const dd = peak === 0 ? 0 : (v - peak) / peak; // negative
    if (dd < maxDD) maxDD = dd;
  }
  return maxDD * 100; // negative %
}

function computeDailyReturnsFromNAV(nav: number[]) {
  const r: number[] = [];
  for (let i = 1; i < nav.length; i++) {
    const prev = nav[i - 1];
    const cur = nav[i];
    if (!prev || prev === 0) continue;
    r.push(cur / prev - 1);
  }
  return r;
}

function computeBestWorstDay(dailyReturns: number[]) {
  if (!dailyReturns.length) return { best: null as any, worst: null as any };
  let best = dailyReturns[0];
  let worst = dailyReturns[0];
  for (const x of dailyReturns) {
    if (x > best) best = x;
    if (x < worst) worst = x;
  }
  return { best: best * 100, worst: worst * 100 };
}

function computePositiveDayPct(dailyReturns: number[]) {
  if (!dailyReturns.length) return null;
  let pos = 0;
  for (const x of dailyReturns) if (x > 0) pos++;
  return (pos / dailyReturns.length) * 100;
}

function AssetDetailModal(props: {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string | null;
  currency: string | null;
}) {
  const { open, onClose, symbol, name, currency } = props;

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("6M");

  const filteredData = useMemo(() => {
    const base = rows
      .filter((r) => r.close !== null && r.close !== undefined)
      .map((r) => ({ date: r.date, close: Number(r.close) }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const start = startDateForRange(range);
    if (!start) return base;
    return base.filter((r) => r.date >= start);
  }, [rows, range]);

  const first = filteredData[0]?.close ?? null;
  const last = filteredData.length ? filteredData[filteredData.length - 1].close : null;

  const changePct =
    first !== null && last !== null && first !== 0 ? ((last - first) / first) * 100 : null;

  const minClose = useMemo(() => {
    if (!filteredData.length) return null;
    let m = filteredData[0].close;
    for (const r of filteredData) m = Math.min(m, r.close);
    return m;
  }, [filteredData]);

  const maxClose = useMemo(() => {
    if (!filteredData.length) return null;
    let m = filteredData[0].close;
    for (const r of filteredData) m = Math.max(m, r.close);
    return m;
  }, [filteredData]);

  useEffect(() => {
    if (!open || !symbol) return;

    (async () => {
      setLoading(true);
      setErr(null);
      setRows([]);

      const attempts: Array<{
        table: string;
        dateCol: string;
        closeCol: string;
        symbolCol: string;
      }> = [
        { table: "asset_prices_daily", dateCol: "date", closeCol: "close", symbolCol: "symbol" },
        { table: "asset_prices_daily", dateCol: "price_date", closeCol: "close", symbolCol: "symbol" },
        { table: "asset_prices_daily", dateCol: "date", closeCol: "close_price", symbolCol: "symbol" },
        { table: "asset_prices_daily", dateCol: "snapshot_date", closeCol: "close", symbolCol: "symbol" },
        { table: "asset_prices_daily", dateCol: "date", closeCol: "close", symbolCol: "ticker" },
      ];

      let lastErr: string | null = null;

      for (const a of attempts) {
        const q = await supabaseBrowser
          .from(a.table)
          .select(`${a.dateCol},${a.closeCol}`)
          .eq(a.symbolCol, symbol)
          .order(a.dateCol, { ascending: true })
          .limit(6000);

        if (!q.error) {
          const mapped: PriceRow[] = (q.data ?? []).map((r: any) => ({
            date: String(r[a.dateCol]).slice(0, 10),
            close:
              r[a.closeCol] === null || r[a.closeCol] === undefined
                ? null
                : Number(r[a.closeCol]),
          }));
          setRows(mapped);
          setLoading(false);
          return;
        }

        lastErr = `${a.table}: ${q.error.message}`;
      }

      setErr(lastErr ?? "No se pudieron cargar precios.");
      setLoading(false);
    })();
  }, [open, symbol]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute left-1/2 top-1/2 w-[min(1000px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {symbol}{" "}
              {name ? <span className="font-normal text-slate-500">— {name}</span> : null}
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

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniStat label="Último cierre" value={last === null ? "—" : fmt(last)} />
              <MiniStat label="Cambio rango" value={changePct === null ? "—" : `${fmt(changePct)}%`} />
              <MiniStat
                label="Min / Max"
                value={
                  minClose === null || maxClose === null
                    ? "—"
                    : `${fmt(minClose)} / ${fmt(maxClose)}`
                }
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["1M", "3M", "6M", "YTD", "1Y", "MAX"] as RangeKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setRange(k)}
                  className={[
                    "rounded-md px-3 py-2 text-xs font-medium border",
                    range === k
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-[380px] rounded-2xl border border-slate-200 bg-white p-3">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-600">
                Cargando precios…
              </div>
            ) : filteredData.length < 2 ? (
              <div className="flex h-full items-center justify-center text-slate-600">
                No hay suficientes datos de precios para este activo en el rango seleccionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
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

export default function SociosPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [latest, setLatest] = useState<PortfolioSnapshot | null>(null);
  const [positions, setPositions] = useState<AnyPositionRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // resumen club
  const [clubRange, setClubRange] = useState<RangeKey>("6M");
  const [clubSeries, setClubSeries] = useState<Array<{ date: string; nav: number | null }>>([]);

  // benchmark
  const [benchSeriesRaw, setBenchSeriesRaw] = useState<
    Array<{ date: string; symbol: string; value: number | null }>
  >([]);
  const benchSymbols = useMemo(() => {
    const s = new Set<string>();
    for (const r of benchSeriesRaw) if (r.symbol) s.add(r.symbol);
    return Array.from(s).sort();
  }, [benchSeriesRaw]);
  const [benchSelected, setBenchSelected] = useState<string>("");

  const [benchMode, setBenchMode] = useState<"RANGO" | "DESDE_INICIO">("DESDE_INICIO");
  const opsStart = useMemo(() => startOfOperationsISO(), []);

  // modal detalle activo
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSymbol, setDetailSymbol] = useState<string>("");
  const [detailName, setDetailName] = useState<string | null>(null);
  const [detailCurrency, setDetailCurrency] = useState<string | null>(null);

  const isMember = useMemo(() => {
    const r = profile?.role;
    return r === "member" || r === "admin";
  }, [profile]);

  const effectiveBenchmarkStart = useMemo(() => {
    if (benchMode === "DESDE_INICIO") return opsStart;
    return startDateForRange(clubRange);
  }, [benchMode, opsStart, clubRange]);

  const clubFiltered = useMemo(() => {
    const base = clubSeries
      .filter((r) => r.nav !== null && r.nav !== undefined)
      .map((r) => ({ date: r.date, nav: Number(r.nav) }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const start = startDateForRange(clubRange);
    if (!start) return base;
    return base.filter((r) => r.date >= start);
  }, [clubSeries, clubRange]);

  const clubCumReturn = useMemo(() => {
    if (!clubFiltered.length) return [];
    const first = clubFiltered[0].nav;
    if (!first || first === 0) return clubFiltered.map((r) => ({ date: r.date, ret: null as any }));
    return clubFiltered.map((r) => ({
      date: r.date,
      ret: ((r.nav - first) / first) * 100,
    }));
  }, [clubFiltered]);

  const clubFirstNav = clubFiltered[0]?.nav ?? null;
  const clubLastNav = clubFiltered.length ? clubFiltered[clubFiltered.length - 1].nav : null;
  const clubRangeReturnPct =
    clubFirstNav !== null && clubLastNav !== null && clubFirstNav !== 0
      ? ((clubLastNav - clubFirstNav) / clubFirstNav) * 100
      : null;

  // ===== NUEVO: métricas riesgo desde inicio (MAX) =====
  const clubAllNavSeries = useMemo(() => {
    return clubSeries
      .filter((r) => r.nav !== null && r.nav !== undefined)
      .map((r) => Number(r.nav))
      .filter((n) => !Number.isNaN(n) && n > 0);
  }, [clubSeries]);

  const clubAllDailyReturns = useMemo(() => computeDailyReturnsFromNAV(clubAllNavSeries), [clubAllNavSeries]);

  const maxDrawdownPct = useMemo(() => computeMaxDrawdown(clubAllNavSeries), [clubAllNavSeries]);

  const vol30 = useMemo(() => {
    if (clubAllDailyReturns.length < 5) return null;
    const last30 = clubAllDailyReturns.slice(-30);
    return annualizedVolFromDailyReturns(last30);
  }, [clubAllDailyReturns]);

  const vol90 = useMemo(() => {
    if (clubAllDailyReturns.length < 5) return null;
    const last90 = clubAllDailyReturns.slice(-90);
    return annualizedVolFromDailyReturns(last90);
  }, [clubAllDailyReturns]);

  const posDayPct = useMemo(() => computePositiveDayPct(clubAllDailyReturns), [clubAllDailyReturns]);

  const bestWorst = useMemo(() => computeBestWorstDay(clubAllDailyReturns), [clubAllDailyReturns]);

  const benchFiltered = useMemo(() => {
    const chosen = benchSelected || (benchSymbols[0] ?? "");
    if (!chosen) return [] as Array<{ date: string; value: number }>;

    const base = benchSeriesRaw
      .filter((r) => r.symbol === chosen && r.value !== null && r.value !== undefined)
      .map((r) => ({ date: r.date, value: Number(r.value) }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const start = effectiveBenchmarkStart;
    if (!start) return base;
    return base.filter((r) => r.date >= start);
  }, [benchSeriesRaw, benchSelected, benchSymbols, effectiveBenchmarkStart]);

  const compareSeries = useMemo(() => {
    const clubNorm = normalizeTo100(clubFiltered.map((r) => ({ date: r.date, value: r.nav })));
    const benchNorm = normalizeTo100(benchFiltered);

    const benchMap = new Map<string, number | null>();
    for (const r of benchNorm) benchMap.set(r.date, r.idx ?? null);

    return clubNorm.map((r) => ({
      date: r.date,
      club: r.idx ?? null,
      bench: benchMap.get(r.date) ?? null,
    }));
  }, [clubFiltered, benchFiltered]);

  const benchReturnPct = useMemo(() => {
    if (benchFiltered.length < 2) return null;
    const first = benchFiltered[0].value;
    const last = benchFiltered[benchFiltered.length - 1].value;
    if (!first || first === 0) return null;
    return ((last - first) / first) * 100;
  }, [benchFiltered]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);

      const { data: sess } = await supabaseBrowser.auth.getSession();
      const session = sess.session;

      if (!session) {
        setLoading(false);
        return;
      }

      setSessionEmail(session.user.email ?? null);

      const { data: prof, error: profErr } = await supabaseBrowser
        .from("profiles")
        .select("role,email")
        .eq("id", session.user.id)
        .single();

      if (profErr) {
        setErr(profErr.message);
        setLoading(false);
        return;
      }

      setProfile(prof ?? null);

      if (!(prof?.role === "member" || prof?.role === "admin")) {
        setLoading(false);
        return;
      }

      // último snapshot
      const { data: snap, error: snapErr } = await supabaseBrowser
        .from("portfolio_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (snapErr) {
        setErr(snapErr.message);
        setLoading(false);
        return;
      }

      const latestSnap = (snap as any) as PortfolioSnapshot | null;
      setLatest(latestSnap ?? null);

      // serie NAV (club)
      const { data: series, error: seriesErr } = await supabaseBrowser
        .from("portfolio_snapshots")
        .select("snapshot_date,nav_eur")
        .order("snapshot_date", { ascending: true })
        .limit(8000);

      if (seriesErr) {
        setErr(seriesErr.message);
        setLoading(false);
        return;
      }

      setClubSeries(
        ((series as any) ?? []).map((r: any) => ({
          date: String(r.snapshot_date).slice(0, 10),
          nav: r.nav_eur === null || r.nav_eur === undefined ? null : Number(r.nav_eur),
        }))
      );

      // benchmark
      const bench = await loadBenchmarkSeriesRobust();
      if (bench.errorText) {
        // benchmark opcional: no queremos “romper” el panel
        // solo mostramos aviso si no había otros errores
        setErr((prev) => prev ?? bench.errorText);
      }
      setBenchSeriesRaw(bench.rows);

      const syms = Array.from(new Set(bench.rows.map((r) => r.symbol).filter(Boolean))).sort();
      if (syms.length && !benchSelected) setBenchSelected(syms[0]);

      // posiciones
      if (latestSnap?.snapshot_date) {
        const { rows, errorText } = await fetchPositionsForDate(latestSnap.snapshot_date);
        if (errorText) setErr((prev) => prev ?? errorText);
        setPositions(rows);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadBenchmarkSeriesRobust(): Promise<{
    rows: Array<{ date: string; symbol: string; value: number | null }>;
    errorText: string | null;
  }> {
    const attempts: Array<{ table: string }> = [
      { table: "benchmark_snapshots" },
      { table: "benchmark_daily" },
    ];

    let lastErr: string | null = null;

    for (const a of attempts) {
      const q = await supabaseBrowser.from(a.table).select("*").limit(8000);
      if (q.error) {
        lastErr = `${a.table}: ${q.error.message}`;
        continue;
      }

      const data = (q.data ?? []) as any[];

      const rows = data
        .map((r) => {
          const date =
            r.snapshot_date ??
            r.date ??
            r.asof_date ??
            r.price_date ??
            r.created_at ??
            null;

          const symbol =
            r.symbol ??
            r.benchmark_symbol ??
            r.ticker ??
            r.index_symbol ??
            r.name ??
            "BENCHMARK";

          const value =
            r.close ??
            r.price ??
            r.value ??
            r.index_value ??
            r.level ??
            r.nav ??
            r.nav_eur ??
            r.close_eur ??
            null;

          if (!date) return null;

          return {
            date: String(date).slice(0, 10),
            symbol: String(symbol),
            value: value === null || value === undefined ? null : Number(value),
          };
        })
        .filter(Boolean) as Array<{ date: string; symbol: string; value: number | null }>;

      if (rows.length) {
        rows.sort((x, y) => (x.date < y.date ? -1 : 1));
        return { rows, errorText: null };
      }

      lastErr = `${a.table}: sin datos utilizables`;
    }

    return { rows: [], errorText: lastErr };
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.push("/socios");
  }

  async function fetchPositionsForDate(snapshotDate: string): Promise<{
    rows: AnyPositionRow[];
    errorText: string | null;
  }> {
    const attempts: Array<{ table: string; dateCol: string }> = [
      { table: "positions_snapshots", dateCol: "snapshot_date" },
      { table: "positions_snapshots", dateCol: "date" },
      { table: "positions_daily", dateCol: "snapshot_date" },
      { table: "positions_daily", dateCol: "date" },
    ];

    let lastErr: string | null = null;

    for (const a of attempts) {
      const r = await supabaseBrowser.from(a.table).select("*").eq(a.dateCol, snapshotDate);

      if (!r.error) {
        const rows = (r.data ?? []) as AnyPositionRow[];

        const rowsSorted = [...rows].sort((x, y) => {
          const wx = Number(pick(x, ["weight_pct", "weight", "weight_percent"]));
          const wy = Number(pick(y, ["weight_pct", "weight", "weight_percent"]));
          if (Number.isNaN(wx) && Number.isNaN(wy)) return 0;
          if (Number.isNaN(wx)) return 1;
          if (Number.isNaN(wy)) return -1;
          return wy - wx;
        });

        return { rows: rowsSorted, errorText: null };
      }

      lastErr = `${a.table}: ${r.error.message}`;
    }

    return { rows: [], errorText: lastErr };
  }

  // ============================
  // VISTA 1: NO LOGUEADO
  // ============================
  if (!loading && !sessionEmail) {
    return (
      <main className="py-14">
        <Container>
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Área privada del socio
            </h1>

            <p className="mt-4 max-w-4xl text-justify leading-relaxed text-slate-600">
              Este espacio está reservado para socios del Club. Aquí se publicará información más
              detallada: composición exacta de la cartera, métricas ampliadas y evolución por activo.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Tag>Acceso restringido</Tag>
              <Tag>Posiciones</Tag>
              <Tag>Métricas</Tag>
              <Tag>Evolución por activo</Tag>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary">Acceso</h2>
                  <p className="mt-2 max-w-2xl text-justify leading-relaxed text-slate-600">
                    Inicia sesión para acceder al panel de socios (posiciones, métricas y seguimiento
                    diario). La información se actualiza una vez al día.
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                  Zona privada
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/login"
                  className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Iniciar sesión
                </a>

                <a
                  href="/contacto"
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  Solicitar acceso
                </a>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <MiniStat label="Actualización" value="Diaria" />
                <MiniStat label="Acceso" value="Solo socios" />
                <MiniStat label="Contenido" value="Panel + métricas" />
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-bg p-6">
              <h3 className="text-lg font-semibold text-primary">Qué encontrarás aquí</h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <Dot />
                  <span>Posiciones exactas y pesos de la cartera</span>
                </li>
                <li className="flex gap-2">
                  <Dot />
                  <span>Rentabilidad y evolución por activo</span>
                </li>
                <li className="flex gap-2">
                  <Dot />
                  <span>Métricas agregadas y comparativas</span>
                </li>
                <li className="flex gap-2">
                  <Dot />
                  <span>Histórico y documentación interna</span>
                </li>
              </ul>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">Nota</p>
                <p className="mt-2 text-sm text-slate-600 text-justify">
                  Contenido educativo/divulgativo. No constituye asesoramiento financiero.
                </p>
              </div>
            </aside>
          </section>
        </Container>
      </main>
    );
  }

  // ============================
  // VISTA 2: LOGUEADO PERO SIN ROL
  // ============================
  if (!loading && sessionEmail && !isMember) {
    return (
      <main className="py-14">
        <Container>
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Área privada del socio
            </h1>
            <p className="mt-2 text-slate-600">
              Sesión iniciada como <span className="font-semibold">{sessionEmail}</span>, pero tu usuario
              no tiene permisos de socio.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={signOut}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Cerrar sesión
              </button>
              <a
                href="/contacto"
                className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Contactar
              </a>
            </div>
          </header>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <p className="text-slate-700">
              Si ya eres socio, te activo el rol <b>member</b> en Supabase (tabla{" "}
              <code className="rounded bg-slate-100 px-2 py-1 text-sm">profiles</code>).
            </p>
          </div>
        </Container>
      </main>
    );
  }

  // ============================
  // VISTA 3: SOCIO (DASHBOARD)
  // ============================
  return (
    <main className="py-14">
      <Container>
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Área privada del socio
            </h1>
            <p className="mt-2 text-slate-600">
              Sesión: <span className="font-semibold">{sessionEmail}</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Última actualización:{" "}
              <span className="font-medium">
                {latest?.created_at ? new Date(latest.created_at).toLocaleString() : "—"}
              </span>
            </p>
          </div>

          <button
            onClick={signOut}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </header>

        {err && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* ===== RESUMEN DEL CLUB ===== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-primary">Resumen del club</h2>

            <div className="flex flex-wrap gap-2">
              {(["1M", "3M", "6M", "YTD", "1Y", "MAX"] as RangeKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setClubRange(k)}
                  className={[
                    "rounded-md px-3 py-2 text-xs font-medium border",
                    clubRange === k
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <MiniStat label="NAV (EUR)" value={fmt(latest?.nav_eur)} />
            <MiniStat label="Rentabilidad 1D" value={fmtPctSmart(latest?.return_1d)} />
            <MiniStat label="Rentabilidad YTD" value={fmtPctSmart(latest?.return_ytd)} />
            <MiniStat label="Rentabilidad ITD" value={fmtPctSmart(latest?.return_itd)} />
            <MiniStat label="P&L total (EUR)" value={fmt(latest?.pnl_total_eur)} />
            <MiniStat
              label={`Rentab. acumulada (${clubRange})`}
              value={clubRangeReturnPct === null ? "—" : `${fmt(clubRangeReturnPct)}%`}
            />
          </div>

          {/* ===== RIESGO (DESDE INICIO) ===== */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Riesgo (desde inicio)</p>
            <div className="mt-3 grid gap-4 md:grid-cols-4">
              <MiniStat label="Max Drawdown" value={maxDrawdownPct === null ? "—" : `${fmt(maxDrawdownPct)}%`} />
              <MiniStat label="Volatilidad 30D (ann.)" value={vol30 === null ? "—" : `${fmt(vol30)}%`} />
              <MiniStat label="Volatilidad 90D (ann.)" value={vol90 === null ? "—" : `${fmt(vol90)}%`} />
              <MiniStat label="% días positivos" value={posDayPct === null ? "—" : `${fmt(posDayPct)}%`} />
              <MiniStat label="Mejor día" value={bestWorst.best === null ? "—" : `${fmt(bestWorst.best)}%`} />
              <MiniStat label="Peor día" value={bestWorst.worst === null ? "—" : `${fmt(bestWorst.worst)}%`} />
              <MiniStat label="Nº días (retornos)" value={String(clubAllDailyReturns.length || "0")} />
              <MiniStat label="Nº snapshots (NAV)" value={String(clubAllNavSeries.length || "0")} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Volatilidad anualizada calculada con retornos diarios (252 días). Drawdown calculado sobre la serie NAV.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">NAV (EUR)</p>
              <div className="mt-3 h-[280px]">
                {clubFiltered.length < 2 ? (
                  <div className="flex h-full items-center justify-center text-slate-600">
                    No hay datos suficientes aún.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clubFiltered}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
                      <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="nav" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Rentabilidad acumulada (%)</p>
              <div className="mt-3 h-[280px]">
                {clubCumReturn.length < 2 ? (
                  <div className="flex h-full items-center justify-center text-slate-600">
                    No hay datos suficientes aún.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clubCumReturn}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
                      <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                      <Tooltip formatter={(v: any) => (v === null || v === undefined ? "—" : `${fmt(v)}%`)} />
                      <Line type="monotone" dataKey="ret" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            NAV y rentabilidad acumulada calculada desde el primer dato del rango seleccionado. Actualización diaria.
          </p>
        </section>

        {/* ===== BENCHMARK (desde inicio operativa) ===== */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-primary">Benchmark</h2>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Comparación</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                value={benchMode}
                onChange={(e) => setBenchMode(e.target.value as any)}
              >
                <option value="DESDE_INICIO">Desde inicio (ayer)</option>
                <option value="RANGO">Usar rango (1M/3M/…)</option>
              </select>

              <span className="ml-2 text-xs font-medium text-slate-500">Referencia</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                value={benchSelected || (benchSymbols[0] ?? "")}
                onChange={(e) => setBenchSelected(e.target.value)}
                disabled={!benchSymbols.length}
              >
                {benchSymbols.length ? (
                  benchSymbols.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))
                ) : (
                  <option value="">(sin datos)</option>
                )}
              </select>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Inicio operativa: <b>{opsStart}</b>. (Si el benchmark no tiene dato exacto ese día, toma el primer dato posterior).
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <MiniStat
              label={`Rentab. club (${benchMode === "DESDE_INICIO" ? "desde inicio" : clubRange})`}
              value={
                benchMode === "DESDE_INICIO"
                  ? (() => {
                      const start = opsStart;
                      const base = clubSeries
                        .filter((r) => r.nav !== null && r.nav !== undefined)
                        .map((r) => ({ date: r.date, nav: Number(r.nav) }))
                        .sort((a, b) => (a.date < b.date ? -1 : 1))
                        .filter((r) => r.date >= start);
                      if (base.length < 2) return "—";
                      const f = base[0].nav;
                      const l = base[base.length - 1].nav;
                      if (!f || f === 0) return "—";
                      return `${fmt(((l - f) / f) * 100)}%`;
                    })()
                  : clubRangeReturnPct === null
                  ? "—"
                  : `${fmt(clubRangeReturnPct)}%`
              }
            />
            <MiniStat
              label={`Rentab. benchmark (${benchMode === "DESDE_INICIO" ? "desde inicio" : clubRange})`}
              value={benchReturnPct === null ? "—" : `${fmt(benchReturnPct)}%`}
            />
            <MiniStat
              label={`Diferencia (${benchMode === "DESDE_INICIO" ? "desde inicio" : clubRange})`}
              value={
                (() => {
                  const club =
                    benchMode === "DESDE_INICIO"
                      ? (() => {
                          const start = opsStart;
                          const base = clubSeries
                            .filter((r) => r.nav !== null && r.nav !== undefined)
                            .map((r) => ({ date: r.date, nav: Number(r.nav) }))
                            .sort((a, b) => (a.date < b.date ? -1 : 1))
                            .filter((r) => r.date >= start);
                          if (base.length < 2) return null;
                          const f = base[0].nav;
                          const l = base[base.length - 1].nav;
                          if (!f || f === 0) return null;
                          return ((l - f) / f) * 100;
                        })()
                      : clubRangeReturnPct;

                  if (club === null || benchReturnPct === null) return "—";
                  return `${fmt(club - benchReturnPct)}%`;
                })()
              }
            />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
              Comparativa normalizada (Base 100)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Se normaliza el primer día del periodo a 100 para comparar trayectorias.
            </p>

            <div className="mt-3 h-[320px]">
              {compareSeries.length < 2 || !benchSymbols.length ? (
                <div className="flex h-full items-center justify-center text-slate-600">
                  No hay datos suficientes de benchmark para mostrar la comparativa.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={compareSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
                    <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="club" dot={false} strokeWidth={2} name="Club (Base 100)" />
                    <Line type="monotone" dataKey="bench" dot={false} strokeWidth={2} name="Benchmark (Base 100)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Si quieres que el benchmark sea exacto desde el inicio, asegúrate de que tu tabla de benchmark tiene un registro para la fecha {opsStart}.
          </p>
        </section>

        {/* ===== POSICIONES ===== */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-primary">Posiciones (snapshot diario)</h2>
            {latest?.snapshot_date && (
              <span className="text-sm text-slate-500">
                Fecha snapshot: <b>{latest.snapshot_date}</b>
              </span>
            )}
          </div>

          {!latest?.snapshot_date ? (
            <p className="mt-4 text-slate-600">
              Aún no hay snapshots en{" "}
              <code className="rounded bg-slate-100 px-2 py-1 text-sm">portfolio_snapshots</code>.
            </p>
          ) : positions.length === 0 ? (
            <p className="mt-4 text-slate-600">No se han encontrado posiciones para ese día.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="py-3 pr-4 font-medium">Símbolo</th>
                    <th className="py-3 pr-4 font-medium">Nombre</th>
                    <th className="py-3 pr-4 font-medium">Qty</th>
                    <th className="py-3 pr-4 font-medium">Avg</th>
                    <th className="py-3 pr-4 font-medium">Close</th>
                    <th className="py-3 pr-4 font-medium">Valor</th>
                    <th className="py-3 pr-4 font-medium">Peso</th>
                    <th className="py-3 pr-4 font-medium">P&L</th>
                    <th className="py-3 pr-2 font-medium">P&L %</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((row, idx) => {
                    const symbol =
                      pick(row, ["symbol", "ticker", "instrument", "conid", "id"]) ?? `row-${idx}`;
                    const name = pick(row, ["name", "description", "instrument_name"]);
                    const ccy = pick(row, ["currency", "ccy"]);
                    const qty = pick(row, ["quantity", "qty", "position", "shares"]);
                    const avg = pick(row, ["avg_cost", "avg_price", "average_cost", "cost_basis"]);
                    const close = pick(row, ["close_price", "close", "price", "last_price"]);
                    const mv = pick(row, ["market_value", "marketValue", "value"]);
                    const w = pick(row, ["weight_pct", "weight", "weight_percent"]);
                    const pnl = pick(row, ["unrealized_pnl", "pnl", "pnl_eur", "pnl_total"]);
                    const pnlPct = pick(row, ["unrealized_pnl_pct", "pnl_pct", "pnl_percent", "return"]);

                    return (
                      <tr key={String(symbol)} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-semibold text-slate-900">
                          <button
                            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                            onClick={() => {
                              setDetailSymbol(String(symbol));
                              setDetailName(name ? String(name) : null);
                              setDetailCurrency(ccy ? String(ccy) : null);
                              setDetailOpen(true);
                            }}
                          >
                            {String(symbol)}
                          </button>
                        </td>
                        <td className="py-3 pr-4 text-slate-700">{name ? String(name) : "—"}</td>
                        <td className="py-3 pr-4 text-slate-700">{fmt(qty, 4)}</td>
                        <td className="py-3 pr-4 text-slate-700">{fmt(avg)}</td>
                        <td className="py-3 pr-4 text-slate-700">{fmt(close)}</td>
                        <td className="py-3 pr-4 text-slate-700">{fmt(mv)}</td>
                        <td className="py-3 pr-4 text-slate-700">{w === null ? "—" : `${fmt(w)}%`}</td>
                        <td className="py-3 pr-4 text-slate-700">{fmt(pnl)}</td>
                        <td className="py-3 pr-2 text-slate-700">
                          {pnlPct === null ? "—" : fmtPctSmart(pnlPct)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <p className="mt-4 text-xs text-slate-500">
                Pincha en un símbolo para ver el detalle del activo. Actualización diaria.
                Contenido educativo/divulgativo; no constituye recomendación de inversión.
              </p>
            </div>
          )}
        </section>

        <AssetDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          symbol={detailSymbol}
          name={detailName}
          currency={detailCurrency}
        />
      </Container>
    </main>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
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

function Dot() {
  return <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />;
}

