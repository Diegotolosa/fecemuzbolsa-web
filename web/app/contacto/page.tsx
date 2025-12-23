import Container from "../../components/container";
import { PageHeader, Card, CardTitle, CardSubtitle, Tag } from "../../components/ui";

export default function ContactoPage() {
  return (
    <main className="page-y">
      <Container>
        <PageHeader
          kicker="Contacto"
          title="Contacto"
          tags={["Colaboraciones", "Charlas y ponencias", "Nuevos socios", "Networking"]}
        >
          <p className="max-w-4xl text-justify leading-relaxed text-slate-600">
            Si te interesa unirte al Club, proponer una colaboración o invitar a
            FECEMUZ Bolsa a una charla, estaremos encantados de hablar contigo.
            Nuestro enfoque es formativo y se basa en el principio de{" "}
            <strong>Learning by Doing</strong>, combinando análisis, disciplina y
            trabajo en equipo.
          </p>
        </PageHeader>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardTitle>¿En qué podemos ayudarte?</CardTitle>
            <CardSubtitle className="text-justify">
              Puedes escribirnos si quieres conocer el funcionamiento del Club,
              participar en nuestras actividades, proponer una charla con
              profesionales o coordinar iniciativas conjuntas con otras
              entidades, clubes o asociaciones universitarias.
            </CardSubtitle>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                title="Nuevos socios"
                text="Información sobre cómo unirse al Club, dinámica de trabajo y actividades."
              />
              <InfoCard
                title="Colaboraciones"
                text="Proyectos conjuntos con clubes, asociaciones y entidades."
              />
              <InfoCard
                title="Charlas y ponencias"
                text="Invitaciones a profesionales del sector financiero."
              />
              <InfoCard
                title="Otras propuestas"
                text="Cualquier iniciativa relacionada con formación financiera universitaria."
              />
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-bg p-6">
              <p className="text-sm text-slate-700">
                <strong>Recomendación:</strong> Para facilitar la comunicación,
                incluye en tu mensaje:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <DotSmall />
                  <span>Tu nombre y entidad (si aplica)</span>
                </li>
                <li className="flex gap-2">
                  <DotSmall />
                  <span>Motivo del contacto</span>
                </li>
                <li className="flex gap-2">
                  <DotSmall />
                  <span>Una breve descripción de la propuesta</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card>
            <CardTitle>Canales de contacto</CardTitle>
            <CardSubtitle className="text-justify">
              Puedes contactar con FECEMUZ Bolsa a través de los siguientes
              canales oficiales:
            </CardSubtitle>

            <div className="mt-5 space-y-4">
              <Channel label="Correo electrónico" value="fecemuzbolsa@unizar.es" />
              <Channel label="LinkedIn" value="FECEMUZ Bolsa" />
              <Channel label="Instagram" value="@fecemuz_bolsa" />
            </div>

            <div className="mt-6 rounded-3xl border border-accent/30 bg-accent/10 p-5">
              <p className="text-sm font-extrabold text-accent">Learning by Doing</p>
              <p className="mt-2 text-sm text-slate-700 text-justify">
                Aprendemos a través de la práctica, el análisis y la toma de
                decisiones responsables en un entorno formativo.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/que-hacemos"
                className="btn btn-primary"
              >
                Ver qué hacemos
              </a>
              <a
                href="/origen"
                className="btn btn-secondary"
              >
                Origen y filosofía
              </a>
            </div>
          </Card>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            La información publicada tiene carácter exclusivamente formativo y
            no constituye asesoramiento financiero ni recomendación de inversión.
          </p>
        </section>
      </Container>
    </main>
  );
}

function DotSmall() {
  return <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />;
}

function InfoCard(props: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm">
      <p className="font-extrabold text-primary">{props.title}</p>
      <p className="mt-2 text-sm text-slate-600 text-justify">{props.text}</p>
    </div>
  );
}

function Channel(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-bg p-4">
      <p className="text-xs font-semibold text-slate-500">{props.label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">{props.value}</p>
    </div>
  );
}




