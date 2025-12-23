import type { Metadata } from "next";
import Container from "../../components/container";
import { PageHeader, Card, CardTitle } from "../../components/ui";

export const metadata: Metadata = {
  title: "Qué hacemos | FECEMUZ Bolsa",
  description:
    "Actividades de FECEMUZ Bolsa: charlas con profesionales, análisis de mercados, newsletter semanal, formación interna y comunidad (Learning by Doing).",
};

export default function QueHacemosPage() {
  return (
    <main className="page-y">
      <Container>
        <PageHeader kicker="Actividades" title="Qué hacemos">
          <p className="mt-4 max-w-4xl text-justify leading-relaxed text-slate-600">
            En FECEMUZ Bolsa trabajamos bajo el principio de{" "}
            <strong>Learning by Doing</strong>. Desarrollamos actividades orientadas
            a la formación práctica en mercados financieros, combinando análisis,
            debate, formación y experiencia aplicada en un entorno universitario.
          </p>
        </PageHeader>

        <section className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            title="Charlas y ponencias con profesionales"
            description="Organizamos charlas y encuentros con profesionales del sector financiero para conocer distintas áreas, trayectorias profesionales y resolver dudas de los socios."
            bullets={[
              "Periodicidad aproximada cada 3–4 semanas",
              "Invitados de banca, gestión de activos y mercados",
              "Espacio para preguntas y networking",
            ]}
            badge="Eventos"
          />

          <FeatureCard
            title="Inversión y análisis de mercados"
            description="Realizamos seguimiento de mercados y análisis de oportunidades, avanzando progresivamente hacia un modelo de inversión simulada con IBKR."
            bullets={[
              "Reuniones periódicas de análisis",
              "Control del riesgo y disciplina",
              "Decisiones basadas en criterio y debate",
            ]}
            badge="Mercados"
          />

          <FeatureCard
            title="Newsletter semanal"
            description="Publicamos un informe semanal con contexto, análisis y reflexiones que refuerzan el aprendizaje y mantienen informados a los socios."
            bullets={[
              "Resumen de mercado y datos clave",
              "Tesis y aprendizajes",
              "Disponible desde la web",
            ]}
            badge="Contenido"
          />

          <FeatureCard
            title="Formación interna"
            description="Los propios socios organizan sesiones formativas para facilitar el aprendizaje progresivo y la integración de nuevos miembros."
            bullets={[
              "Píldoras formativas desde nivel básico",
              "Práctica con herramientas reales",
              "Ambiente colaborativo",
            ]}
            badge="Formación"
          />

          <FeatureCard
            title="Actividades extraordinarias"
            description="Organizamos visitas y actividades especiales para conocer el sector desde dentro y vivir experiencias formativas únicas."
            bullets={[
              "Visitas institucionales y eventos",
              "Masterclass y encuentros",
              "Experiencias exclusivas para socios",
            ]}
            badge="Club"
          />

          <FeatureCard
            title="Eventos sociales y comunidad"
            description="Fomentamos la cohesión del Club mediante actividades sociales que permiten a los socios conocerse mejor y fortalecer el espíritu de grupo."
            bullets={[
              "Cenas y encuentros informales entre socios",
              "Actividades sociales fuera del ámbito académico",
              "Construcción de una comunidad activa y cercana",
            ]}
            badge="Comunidad"
          />
        </section>

        <Card className="mt-12">
          <CardTitle>Colaboración con otros clubes y entidades</CardTitle>

          <p className="mt-3 max-w-4xl text-justify leading-relaxed text-slate-600">
            En FECEMUZ Bolsa creemos en el valor de compartir experiencias y aprender de otras
            iniciativas similares. Por ello, buscamos activamente conectar y colaborar con otros
            clubes universitarios, asociaciones estudiantiles y entidades interesadas en los
            mercados financieros y la formación práctica.
          </p>

          <p className="mt-3 max-w-4xl text-justify leading-relaxed text-slate-600">
            Si representas a otro club, asociación o proyecto y estás interesado en organizar
            actividades conjuntas, charlas, encuentros o cualquier tipo de colaboración,
            estaremos encantados de escucharte.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/socios" className="btn btn-primary">
              Área de socios
            </a>

            <a href="/contacto" className="btn btn-secondary">
              Contacta con nosotros
            </a>
          </div>
        </Card>
      </Container>
    </main>
  );
}

function FeatureCard(props: {
  title: string;
  description: string;
  bullets: string[];
  badge: string;
}) {
  return (
    <article className="card card-hover p-6">
      <div className="mb-3 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-extrabold text-accent">
        {props.badge}
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-primary">
        {props.title}
      </h3>

      <p className="mt-2 text-justify leading-relaxed text-slate-600">
        {props.description}
      </p>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {props.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}








