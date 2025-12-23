import Container from "../../components/container";
import { PageHeader, Card, CardTitle, CardSubtitle, Tag } from "../../components/ui";

export const revalidate = 60;

type Metric = {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "positive" | "negative";
};

export default async function RendimientoPage() {
  // Cuando tengas datos reales (IBKR): pon hasRealData = true y rellena métricas + serie temporal.
  const hasRealData = false;

  const metrics: Metric[] = [
    {
      label: "Rentabilidad YTD",
      value: hasRealData ? "+0,00%" : "—",
      sub: hasRealData ? "vs benchmark: +0,00%" : "vs benchmark: —",
      tone: "neutral",
    },
    {
      label: "Rentabilidad acumulada",
      value: hasRealData ? "+0,00%" : "—",
      sub: hasRealData ? "Desde inicio" : "Desde inicio: —",
      tone: "neutral",
    },
    {
      label: "Volatilidad",
      value: hasRealData ? "0,00%" : "—",
      sub: hasRealData ? "Periodo: 1 año" : "Periodo: —",
      tone: "neutral",
    },
    {
      label: "Máx. drawdown",
      value: hasRealData ? "-0,00%" : "—",
      sub: hasRealData ? "Periodo: 1 año" : "Periodo: —",
      tone: "neutral",
    },
  ];

  return (
    <main className="page-y">
      <Container>
        <PageHeader
          kicker="Rendimiento & benchmark"
          title="Rendimiento y Benchmark"
          tags={["Cuenta demo IBKR", "Actualización diaria", "Benchmark", "Métricas de riesgo"]}
        >
          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            En esta sección se publicará el <strong>rendimiento agregado</strong> de la cartera de{" "}
            <strong>FECEMUZ Bolsa</strong>, comparado con su benchmark de referencia (por ejemplo,{" "}
            <strong>S&amp;P 500</strong>). El objetivo es ofrecer una visión clara de la evolución
            temporal de la cartera y de su comportamiento relativo frente a un índice amplio y
            reconocido.
          </p>

          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            Los datos se actualizarán automáticamente cuando comience la operativa en la cuenta demo
            de IBKR. Se mostrarán métricas de rentabilidad y riesgo para reforzar la transparencia y
            facilitar el seguimiento. La composición detallada y materiales internos podrán estar
            restringidos al <strong>Área de Socios</strong>.
          </p>
        </PageHeader>

        {/* Selector de “entidades” */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <TopCard title="Benchmark" main="S&amp;P 500" meta="Fuente: pendiente de conectar" />
          <TopCard title="Cartera" main="FECEMUZ Bolsa" meta="Datos: se activarán al comenzar la operativa" />
        </section>

        {/* KPIs */}
        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
                Métricas
              </div>
              <h2 className="mt-3 text-xl font-extrabold tracking-tight text-primary">
                Indicadores clave
              </h2>
            </div>

            <span className="text-sm text-slate-500">
              Última actualización: <strong>pendiente</strong>
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <KpiCard
                key={m.label}
                label={m.label}
                value={m.value}
                sub={m.sub}
                tone={m.tone}
              />
            ))}
          </div>
        </section>

        {/* Gráfico */}
        <Card className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
                Evolución
              </div>

              <CardTitle className="mt-3">Evolución (cartera vs benchmark)</CardTitle>

              <p className="mt-1 text-sm text-slate-600">
                Gráfico comparativo del rendimiento a lo largo del tiempo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Pill>1M</Pill>
              <Pill>3M</Pill>
              <Pill>6M</Pill>
              <Pill>YTD</Pill>
              <Pill>All</Pill>
            </div>
          </div>

          <div className="mt-6">
            {!hasRealData ? (
              <EmptyState />
            ) : (
              <div className="h-72 rounded-2xl border border-slate-200 bg-bg" />
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-slate-600">
              Última actualización: <strong>pendiente</strong>
            </span>
            <span className="text-slate-500">
              Nota: métricas agregadas y comparativas; acceso ampliado disponible para socios.
            </span>
          </div>
        </Card>

        {/* Disclaimer */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            La información presentada tiene carácter exclusivamente formativo y no constituye
            asesoramiento financiero ni recomendación de inversión.
          </p>
        </section>
      </Container>
    </main>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function TopCard(props: { title: string; main: string; meta: string }) {
  return (
    <article className="card card-hover p-6">
      <p className="text-xs font-semibold text-slate-500">{props.title}</p>
      <p
        className="mt-2 text-xl font-extrabold tracking-tight text-primary"
        dangerouslySetInnerHTML={{ __html: props.main }}
      />
      <p className="mt-2 text-sm text-slate-600">{props.meta}</p>
    </article>
  );
}

function KpiCard(props: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    props.tone === "positive"
      ? "text-emerald-700"
      : props.tone === "negative"
      ? "text-red-700"
      : "text-slate-900";

  return (
    <article className="card card-hover p-6">
      <p className="text-xs font-semibold text-slate-500">{props.label}</p>
      <p className={`mt-2 text-3xl font-extrabold tracking-tight ${toneClass}`}>
        {props.value}
      </p>
      {props.sub ? <p className="mt-2 text-sm text-slate-600">{props.sub}</p> : null}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-bg p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <p className="font-extrabold text-slate-900">
            Aún no hay datos de rendimiento disponibles.
          </p>
          <p className="mt-2 text-sm text-slate-600 text-justify">
            Esta sección se completará automáticamente cuando comience la operativa en la cuenta demo de IBKR.
            Se mostrarán métricas agregadas, evolución temporal y comparación con benchmark, con actualización diaria.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Badge>Estado: pendiente de operativa</Badge>
            <Badge>Fuente: IBKR demo</Badge>
            <Badge>Frecuencia: diaria</Badge>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-accent/30 bg-white px-5 py-4 text-sm font-extrabold text-accent">
          Preparado para datos reales
        </div>
      </div>

      <div className="mt-6 h-56 rounded-2xl border border-dashed border-slate-300 bg-white" />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}







