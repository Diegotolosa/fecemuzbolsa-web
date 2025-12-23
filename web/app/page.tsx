import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/container";
import { Card, Dot, Stat } from "../components/ui";

export const metadata: Metadata = {
  title: "FECEMUZ Bolsa | Club universitario de inversión (UZ)",
  description:
    "FECEMUZ Bolsa es una asociación estudiantil de la Universidad de Zaragoza orientada a la formación práctica en mercados financieros (Learning by Doing).",
};

export default function HomePage() {
  return (
    <main className="page-y">
      <Container>
        <Card className="p-6 sm:p-8 md:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Izquierda */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                Learning by Doing
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                FECEMUZ Bolsa
              </h1>

              <p className="mt-4 text-justify text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
                Asociación estudiantil de la Universidad de Zaragoza orientada a
                la formación práctica en mercados financieros. Nuestro enfoque
                combina análisis, disciplina y aprendizaje aplicado en un
                entorno universitario serio y colaborativo.
              </p>

              {/* Botones: en móvil apilan y ocupan ancho */}
              <div className="mt-6 grid gap-3 sm:mt-7 sm:flex sm:flex-wrap">
                <Link href="/que-hacemos" className="btn btn-primary w-full sm:w-auto">
                  Ver qué hacemos
                </Link>

                <Link href="/socios" className="btn btn-secondary w-full sm:w-auto">
                  Área de socios
                </Link>

                <Link href="/contacto" className="btn btn-tertiary w-full sm:w-auto">
                  Contacto
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3">
                <Stat label="Enfoque" value="Práctico" />
                <Stat label="Método" value="Rigor + equipo" />
                <Stat label="Contenido" value="Semanal" />
              </div>
            </div>

            {/* Derecha */}
            <aside className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Señales de confianza
                </div>

                <h2 className="mt-4 text-lg font-extrabold text-slate-900">
                  Señales de confianza
                </h2>

                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <Dot />
                    <span>
                      🏆{" "}
                      <span className="font-semibold">Ganadores Liga de Bolsa</span>{" "}
                      (competición nacional) —{" "}
                      <span className="font-semibold">2023</span>
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <Dot />
                    <span>
                      Asociación registrada en la{" "}
                      <span className="font-semibold">Universidad de Zaragoza</span>{" "}
                      y en Aragón
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <Dot />
                    <span>
                      Enfoque formativo:{" "}
                      <span className="font-semibold">
                        análisis, método y gestión responsable del riesgo
                      </span>
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <Dot />
                    <span>
                      Informes y seguimiento:{" "}
                      <span className="font-semibold">
                        repositorio semanal y comparativa con benchmark
                      </span>
                    </span>
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Nota</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    El rendimiento y métricas se completarán automáticamente
                    cuando comience la operativa en la cuenta de IBKR.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Card>
      </Container>
    </main>
  );
}




