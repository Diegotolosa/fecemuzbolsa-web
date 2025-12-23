import Container from "../../components/container";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader, Card, CardTitle, CardSubtitle, Tag } from "../../components/ui";

export const revalidate = 60;

export default async function InformesSemanalesPage() {
  const { data, error } = await supabase.storage
    .from("weekly-briefing")
    .list("", { limit: 100, sortBy: { column: "name", order: "desc" } });

  const files = data?.filter((f) => f.name.toLowerCase().endsWith(".pdf")) ?? [];

  return (
    <main className="page-y">
      <Container>
        <PageHeader
          kicker="Informes Semanales"
          title="Informes Semanales"
          tags={["PDF", "Repositorio histórico", "Actualización semanal", "Enfoque formativo"]}
        >
          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            En esta sección se publican los informes semanales del Club. Estos documentos recogen
            el seguimiento agregado del rendimiento de la actividad, el contexto de mercado y
            los aprendizajes que se van extrayendo semana a semana.
          </p>

          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            El objetivo de estos informes es ofrecer una visión clara y ordenada de la evolución
            del trabajo del Club, aportando transparencia sobre las métricas generales y
            facilitando un registro histórico para comparar periodos, revisar decisiones y
            consolidar una metodología de análisis.
          </p>

          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            En los informes se incluyen, cuando corresponde, referencias al benchmark de mercado,
            comentarios sobre movimientos relevantes y una síntesis de las ideas tratadas en las
            sesiones de análisis. La información detallada (por ejemplo, composición concreta o
            material interno) puede estar reservada para socios y consultarse a través del{" "}
            <strong>Área de Socios</strong>.
          </p>

          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            Los documentos se almacenan en formato PDF y se presentan por orden cronológico para
            facilitar su consulta. La lista se actualiza automáticamente conforme se incorporan
            nuevos informes.
          </p>
        </PageHeader>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm font-semibold text-red-700">
              Error cargando archivos: {error.message}
            </p>
          </Card>
        )}

        {!error && files.length === 0 && (
          <Card className="bg-white">
            <CardTitle>Todavía no hay informes disponibles.</CardTitle>
            <CardSubtitle>
              Esta sección se completará automáticamente conforme se incorporen nuevos informes.
            </CardSubtitle>
          </Card>
        )}

        {!error && files.length > 0 && (
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
                  Listado
                </div>
                <CardTitle className="mt-3">Listado de informes</CardTitle>
              </div>

              <span className="chip">{files.length} documento(s)</span>
            </div>

            <ul className="space-y-3">
              {files.map((f) => {
                const { data: pub } = supabase.storage
                  .from("weekly-briefing")
                  .getPublicUrl(f.name);

                return (
                  <li
                    key={f.name}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex min-w-[260px] items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <span className="text-sm font-extrabold text-slate-900">
                          PDF
                        </span>
                      </div>

                      <div>
                        <p className="font-extrabold text-slate-900">{f.name}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Formato: PDF
                        </p>
                      </div>
                    </div>

                    <a
                      href={pub.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary px-5 py-2.5"
                    >
                      Descargar
                    </a>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            La información presentada tiene carácter exclusivamente formativo y no constituye
            asesoramiento financiero ni recomendación de inversión.
          </p>
        </section>
      </Container>
    </main>
  );
}




