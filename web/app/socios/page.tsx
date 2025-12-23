import Container from "../../components/container";

export default function SociosPage() {
  return (
    <main className="py-14">
      <Container>
        {/* Cabecera */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Área privada del socio
          </h1>

          <p className="mt-4 max-w-4xl text-justify leading-relaxed text-slate-600">
            Este espacio está reservado para socios del Club. Aquí se publicará información más
            detallada y material interno (por ejemplo: composición, notas de seguimiento, métricas
            ampliadas, documentación y recursos de trabajo). De momento, esta página funciona como
            base visual mientras se integra el acceso y la protección de rutas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Tag>Acceso restringido</Tag>
            <Tag>Contenido interno</Tag>
            <Tag>Métricas ampliadas</Tag>
            <Tag>Documentación</Tag>
          </div>
        </header>

        {/* Panel principal */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Card acceso */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary">Acceso</h2>
                <p className="mt-2 max-w-2xl text-justify leading-relaxed text-slate-600">
                  Próximo paso: implementar autenticación (por ejemplo, Supabase Auth) y protección
                  de rutas para que el contenido solo sea visible a socios autorizados.
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                Zona privada
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Iniciar sesión (pendiente)
              </button>

              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Solicitar acceso (pendiente)
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <MiniStat label="Estado" value="En construcción" />
              <MiniStat label="Auth" value="Supabase (pendiente)" />
              <MiniStat label="Acceso" value="Solo socios" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rounded-2xl border border-slate-200 bg-bg p-6">
            <h3 className="text-lg font-semibold text-primary">Qué encontrarás aquí</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <Dot />
                <span>Material interno de trabajo y documentación</span>
              </li>
              <li className="flex gap-2">
                <Dot />
                <span>Métricas ampliadas y seguimiento más detallado</span>
              </li>
              <li className="flex gap-2">
                <Dot />
                <span>Notas, recursos y contenidos reservados</span>
              </li>
              <li className="flex gap-2">
                <Dot />
                <span>Acceso a información de interés para socios</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium text-slate-500">Nota</p>
              <p className="mt-2 text-sm text-slate-600 text-justify">
                La información pública del Club se mantiene en las secciones generales del sitio.
                Esta zona se destina exclusivamente a contenido interno.
              </p>
            </div>
          </aside>
        </section>

        {/* CTA inferior */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">
            ¿Aún no eres socio?
          </h2>

          <p className="mt-2 max-w-4xl text-justify leading-relaxed text-slate-600">
            Si te interesa participar en el Club, asistir a sesiones formativas, colaborar en análisis
            y acceder al contenido interno, ponte en contacto con nosotros. Te indicaremos los pasos
            para unirte y las condiciones de participación.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/contacto"
              className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Contactar
            </a>

            <a
              href="/que-hacemos"
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Ver qué hacemos
            </a>
          </div>
        </section>
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

