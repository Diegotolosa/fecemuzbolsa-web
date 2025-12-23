export default function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Marca */}
          <div>
            <p className="font-bold tracking-tight text-primary">
              FECEMUZ Bolsa
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Asociación estudiantil — Universidad de Zaragoza.
            </p>

            <div className="mt-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Learning by Doing
            </div>

            <p className="mt-4 text-xs text-slate-500">
              La información publicada tiene carácter formativo y no constituye
              asesoramiento financiero.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-sm font-semibold text-primary">Navegación</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-slate-700 hover:text-primary" href="/origen">
                  Origen y filosofía
                </a>
              </li>
              <li>
                <a
                  className="text-slate-700 hover:text-primary"
                  href="/que-hacemos"
                >
                  Qué hacemos
                </a>
              </li>
              <li>
                <a
                  className="text-slate-700 hover:text-primary"
                  href="/rendimiento"
                >
                  Rendimiento & benchmark
                </a>
              </li>
              <li>
                <a
                  className="text-slate-700 hover:text-primary"
                  href="/informes-semanales"
                >
                  Informes semanales
                </a>
              </li>
              <li>
                <a className="text-slate-700 hover:text-primary" href="/socios">
                  Área socios
                </a>
              </li>

              <li className="pt-2">
                <a className="text-slate-700 hover:text-primary" href="/legal">
                  Aviso legal
                </a>
              </li>
              <li>
                <a
                  className="text-slate-700 hover:text-primary"
                  href="/privacidad"
                >
                  Política de privacidad
                </a>
              </li>
              <li>
                <a
                  className="text-slate-700 hover:text-primary"
                  href="/cookies"
                >
                  Política de cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto / colaboración */}
          <div>
            <p className="text-sm font-semibold text-primary">
              Colaboraciones
            </p>
            <p className="mt-3 text-sm text-slate-600 text-justify">
              Si representas a otro club, entidad o proyecto y quieres organizar
              actividades conjuntas, charlas o encuentros, estaremos encantados
              de hablar.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/contacto"
                className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Contacto
              </a>
              <a
                href="/socios"
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Área socios
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} FECEMUZ Bolsa · Universidad de Zaragoza
          </span>
          <span>Diseño y contenido: FECEMUZ Bolsa</span>
        </div>
      </div>
    </footer>
  );
}


