import type { Metadata } from "next";
import Container from "../../components/container";
import { PageHeader, Card, CardTitle } from "../../components/ui";

export const metadata: Metadata = {
  title: "Origen y filosofía | FECEMUZ Bolsa",
  description:
    "Origen, misión, filosofía y valores de FECEMUZ Bolsa (Universidad de Zaragoza). Metodología Learning by Doing, rigor y gestión responsable del riesgo.",
};

export default function OrigenPage() {
  return (
    <main className="page-y">
      <Container>
        <PageHeader
          kicker="Origen & filosofía"
          title="Origen y Filosofía"
          tags={["Learning by Doing", "Formación práctica", "Riesgo y disciplina", "Transparencia"]}
        >
          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            FECEMUZ Bolsa es una asociación estudiantil inscrita en el Registro de Asociaciones
            de la Universidad de Zaragoza y en el Registro de Asociaciones de Aragón. Está formada
            por estudiantes de la Universidad de Zaragoza y cuenta con el apoyo de la propia Universidad.
          </p>
        </PageHeader>

        {/* Origen */}
        <Card className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
                Historia
              </div>
              <CardTitle className="mt-3">Origen</CardTitle>
            </div>

            <div className="flex flex-wrap gap-3">
              <MiniStat label="Inicio" value="2020" />
              <MiniStat label="Nombre actual" value="Desde 2022" />
              <MiniStat label="Base" value="Universidad de Zaragoza" />
            </div>
          </div>

          <div className="mt-5 space-y-4 text-justify leading-relaxed text-slate-600">
            <p>
              El proyecto nace en 2020 bajo la denominación <strong>UNIZAR Investment Club</strong>,
              con la participación de más de <strong>30 estudiantes</strong>. En 2022, el Club evoluciona y
              adopta su nombre actual: <strong>FECEMUZ Bolsa</strong>.
            </p>

            <p>
              Desde sus inicios, FECEMUZ Bolsa surge de la iniciativa de estudiantes interesados en formarse
              en los mercados financieros mediante un enfoque práctico, basado en el método{" "}
              <strong>“learning by doing”</strong>, que sigue siendo uno de los pilares fundamentales de la asociación.
            </p>

            <p>
              A lo largo de los años, el número de socios ha crecido de forma constante, reflejando el creciente
              interés por la formación financiera práctica y el compromiso del Club con el aprendizaje continuo.
            </p>
          </div>
        </Card>

        {/* Reconocimiento */}
        <Card className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-xl font-extrabold text-accent">
              🏆
            </div>

            <div>
              <CardTitle>Reconocimiento nacional</CardTitle>

              <p className="mt-3 max-w-4xl text-justify leading-relaxed text-slate-600">
                En el año <strong>2023</strong>, FECEMUZ Bolsa resultó ganador de la{" "}
                <strong>Liga de Bolsa</strong> a nivel nacional, una competición universitaria
                que evalúa el desempeño, la consistencia y la toma de decisiones en mercados
                financieros.
              </p>

              <p className="mt-3 max-w-4xl text-justify leading-relaxed text-slate-600">
                Este reconocimiento refleja el trabajo continuado del Club, la aplicación
                rigurosa de su metodología formativa y el compromiso de sus socios con el
                aprendizaje práctico y la gestión responsable.
              </p>
            </div>
          </div>
        </Card>

        {/* Filosofía */}
        <Card className="mb-10 bg-white">
          <CardTitle>Filosofía</CardTitle>

          <div className="mt-4 space-y-4 text-justify leading-relaxed text-slate-600">
            <p>
              La filosofía del Club parte de la idea de que la mejor forma de aprender sobre productos financieros
              es a través de su aplicación real. Por ello, FECEMUZ Bolsa se caracteriza por el uso de recursos
              tecnológicos disponibles para analizar mercados y practicar la toma de decisiones, siempre con un
              enfoque formativo y responsable.
            </p>

            <p>
              El aprendizaje no se limita a “ver qué pasa”, sino a comprender por qué se toman determinadas decisiones,
              cómo se evalúan y qué se aprende del resultado. Se prioriza el método, la disciplina y el debate constructivo.
            </p>

            <p>
              Buscamos desarrollar habilidades aplicables al entorno profesional: análisis fundamentado, pensamiento crítico,
              comunicación clara de ideas, trabajo en equipo y control del riesgo.
            </p>
          </div>
        </Card>

        {/* Misión */}
        <Card className="mb-10">
          <CardTitle>Nuestra misión</CardTitle>

          <p className="mt-4 text-justify leading-relaxed text-slate-600">
            La misión de FECEMUZ Bolsa es formar a estudiantes de la Universidad de Zaragoza en los mercados financieros
            mediante un enfoque práctico y riguroso, combinando teoría y experiencia real. El Club busca acercar la inversión
            y la gestión financiera al ámbito universitario, fomentando el pensamiento crítico, la toma de decisiones responsables
            y el desarrollo de habilidades aplicables al entorno profesional.
          </p>
        </Card>

        {/* Valores */}
        <section className="mb-12">
          <div className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700">
            Identidad
          </div>

          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-primary">
            Nuestros valores
          </h2>

          <p className="mt-3 max-w-4xl text-justify leading-relaxed text-slate-600">
            Nuestros valores definen cómo trabajamos y cómo entendemos el aprendizaje: exigencia, colaboración, responsabilidad
            y transparencia, en un entorno universitario serio y constructivo.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <ValueCard
              title="Aprendizaje práctico (Learning by doing)"
              desc="Creemos en el aprendizaje activo como eje central de la formación. Los socios participan directamente en el análisis, la inversión y la gestión de carteras como parte del proceso formativo."
            />
            <ValueCard
              title="Rigor y profesionalidad"
              desc="Promovemos el análisis fundamentado, la disciplina y el uso de criterios objetivos, acercando a los socios a estándares del sector financiero profesional."
            />
            <ValueCard
              title="Responsabilidad y gestión del riesgo"
              desc="Entendemos la inversión como una herramienta de aprendizaje que debe ir acompañada de prudencia, control del riesgo y una gestión responsable de los recursos."
            />
            <ValueCard
              title="Formación continua"
              desc="Fomentamos el desarrollo constante mediante sesiones formativas, análisis de mercado e intercambio de conocimientos, adaptándonos a un entorno financiero en permanente cambio."
            />
            <ValueCard
              title="Colaboración y espíritu universitario"
              desc="Proyecto colectivo basado en trabajo en equipo, debate constructivo y participación activa de los socios, en un entorno abierto y respetuoso."
            />
            <ValueCard
              title="Transparencia"
              desc="Defendemos la claridad en procesos, decisiones y resultados, tanto internamente como en la relación con la Universidad y las instituciones que nos apoyan."
            />
          </div>
        </section>

        {/* CTA */}
        <Card>
          <CardTitle>Conoce nuestras actividades y el seguimiento de rendimiento</CardTitle>

          <p className="mt-2 text-justify leading-relaxed text-slate-600">
            Si quieres ver cómo trabajamos, consulta “Qué hacemos”. Para el seguimiento de métricas agregadas y comparativa
            con benchmark, visita “Rendimiento & benchmark”.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/que-hacemos" className="btn btn-primary">
              Ver qué hacemos
            </a>

            <a href="/rendimiento" className="btn btn-secondary">
              Ver rendimiento
            </a>
          </div>
        </Card>
      </Container>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <article className="card card-hover p-6">
      <h3 className="text-lg font-extrabold tracking-tight text-primary">{title}</h3>
      <p className="mt-3 text-justify leading-relaxed text-slate-600">{desc}</p>
    </article>
  );
}


