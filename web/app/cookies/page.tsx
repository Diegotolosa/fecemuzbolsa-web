import Container from "../../components/container";

export default function CookiesPage() {
  return (
    <main className="py-14">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Política de cookies
        </h1>

        <div className="mt-6 max-w-4xl space-y-4 text-justify leading-relaxed text-slate-600">
          <p>
            Este sitio web utiliza cookies y tecnologías similares únicamente en
            la medida necesaria para su funcionamiento y, en su caso, para
            análisis de uso si se activan herramientas de analítica en el futuro.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            ¿Qué son las cookies?
          </h2>
          <p>
            Son pequeños archivos que se descargan en tu dispositivo al acceder a
            un sitio web. Permiten, entre otras cosas, recordar preferencias o
            medir el uso del sitio.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Cookies utilizadas
          </h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Cookies técnicas:</strong> necesarias para el
              funcionamiento básico del sitio.
            </li>
            <li>
              <strong>Analítica (opcional):</strong> actualmente no se utiliza
              analítica avanzada. Si se activara en el futuro, se informará
              debidamente.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Cómo gestionar cookies
          </h2>
          <p>
            Puedes configurar tu navegador para bloquear o eliminar cookies. Ten
            en cuenta que algunas funciones podrían no estar disponibles si las
            deshabilitas.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Más información
          </h2>
          <p>
            Para cualquier duda, puedes escribirnos desde{" "}
            <a href="/contacto">Contacto</a>.
          </p>
        </div>
      </Container>
    </main>
  );
}
