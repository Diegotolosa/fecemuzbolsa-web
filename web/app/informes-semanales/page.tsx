import type { Metadata } from "next";
import Container from "../../components/container";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader, Card, CardTitle, CardSubtitle } from "../../components/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Informes semanales",
  description:
    "Repositorio histórico de informes semanales de FECEMUZ Bolsa. Documentos en PDF con seguimiento de mercados, rendimiento agregado y aprendizajes con enfoque formativo.",
  alternates: { canonical: "/informes-semanales" },
};

type StorageItem = {
  name: string;
  id?: string | null;
  updated_at?: string | null;
};

function isPdf(name: string) {
  return name.toLowerCase().endsWith(".pdf");
}

// Lista PDFs en una ruta ("" = raíz). Devuelve paths completos (ej: "2025/archivo.pdf")
async function listPdfPaths(path: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from("weekly-briefing")
    .list(path, { limit: 100, sortBy: { column: "name", order: "desc" } });

  if (error) throw new Error(error.message);

  const items = (data ?? []) as StorageItem[];

  const pdfsHere = items
    .filter((i) => isPdf(i.name))
    .map((i) => (path ? `${path}/${i.name}` : i.name));

  // Detecta “carpetas” (en Supabase suelen venir como items sin .pdf y sin extensión)
  // y lista 1 nivel dentro para encontrar PDFs.
  const folderCandidates = items
    .filter((i) => !isPdf(i.name))
    .map((i) => (path ? `${path}/${i.name}` : i.name));

  const pdfsInFolders: string[] = [];
  for (const folderPath of folderCandidates) {
    try {
      const { data: inner, error: innerErr } = await supabase.storage
        .from("weekly-briefing")
        .list(folderPath, { limit: 100, sortBy: { column: "name", order: "desc" } });

      if (innerErr) continue;

      const innerItems = (inner ?? []) as StorageItem[];
      const innerPdfs = innerItems
        .filter((x) => isPdf(x.name))
        .map((x) => `${folderPath}/${x.name}`);

      pdfsInFolders.push(...innerPdfs);
    } catch {
      // si no es carpeta real o no tiene permisos, se ignora
    }
  }

  return [...pdfsHere, ...pdfsInFolders];
}

export default async function InformesSemanalesPage() {
  let errorMsg: string | null = null;
  let pdfPaths: string[] = [];

  try {
    // Raíz + 1 nivel de carpetas
    pdfPaths = await listPdfPaths("");

    // Orden final por nombre desc (si usas YYYY-MM-DD... queda perfecto)
    pdfPaths.sort((a, b) => b.localeCompare(a));
  } catch (e: any) {
    errorMsg = e?.message ?? "Error desconocido";
  }

  return (
    <main className="page-y">
      <Container>
        <PageHeader
          kicker="Informes Semanales"
          title="Informes Semanales"
          tags={[
            "PDF",
            "Repositorio histórico",
            "Actualización semanal",
            "Enfoque formativo",
          ]}
        >
          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            En esta sección se publican los informes semanales del Club. Estos
            documentos recogen el seguimiento agregado del rendimiento de la
            actividad, el contexto de mercado y los aprendizajes que se van
            extrayendo semana a semana.
          </p>

          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            El objetivo de estos informes es ofrecer una visión clara y ordenada
            de la evolución del trabajo del Club, aportando transparencia sobre
            las métricas generales y facilitando un registro histórico para
            comparar periodos, revisar decisiones y consolidar una metodología
            de análisis.
          </p>

          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            En los informes se incluyen, cuando corresponde, referencias al
            benchmark de mercado, comentarios sobre movimientos relevantes y una
            síntesis de las ideas tratadas en las sesiones de análisis. La
            información detallada (por ejemplo, composición concreta o material
            interno) puede estar reservada para socios y consultarse a través del{" "}
            <strong>Área de Socios</strong>.
          </p>
        </PageHeader>

        {errorMsg && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm font-semibold text-red-700">
              Error cargando archivos: {errorMsg}
            </p>
          </Card>
        )}

        {!errorMsg && pdfPaths.length === 0 && (
          <Card className="bg-white">
            <CardTitle>Todavía no hay informes disponibles</CardTitle>
            <CardSubtitle>
              Esta sección se completará automáticamente conforme se incorporen
              nuevos informes.
            </CardSubtitle>
          </Card>
        )}

        {!errorMsg && pdfPaths.length > 0 && (
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
                  Listado
                </div>
                <CardTitle className="mt-3">Listado de informes</CardTitle>
              </div>

              <span className="chip">{pdfPaths.length} documento(s)</span>
            </div>

            <ul className="space-y-3">
              {pdfPaths.map((path) => {
                const { data: publicUrl } = supabase.storage
                  .from("weekly-briefing")
                  .getPublicUrl(path);

                const filename = path.split("/").pop() ?? path;

                return (
                  <li
                    key={path}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex min-w-[260px] items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <span className="text-sm font-extrabold text-slate-900">
                          PDF
                        </span>
                      </div>

                      <div>
                        <p className="font-extrabold text-slate-900">
                          {filename}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Ruta: {path}
                        </p>
                      </div>
                    </div>

                    <a
                      href={publicUrl.publicUrl}
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
            La información presentada tiene carácter exclusivamente formativo y
            no constituye asesoramiento financiero ni recomendación de inversión.
          </p>
        </section>
      </Container>
    </main>
  );
}



