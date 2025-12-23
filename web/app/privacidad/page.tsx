import Container from "../../components/container";

export default function PrivacidadPage() {
  return (
    <main className="py-14">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Política de privacidad
        </h1>

        <div className="mt-6 max-w-4xl space-y-4 text-justify leading-relaxed text-slate-600">
          <p>
            En FECEMUZ Bolsa nos tomamos en serio la privacidad de los usuarios.
            Esta política describe cómo tratamos los datos personales cuando
            interactúas con este sitio web.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Responsable del tratamiento
          </h2>
          <p>
            Responsable: FECEMUZ Bolsa (asociación estudiantil vinculada a la
            Universidad de Zaragoza). Para contactar: consulta la página de{" "}
            <a href="/contacto">Contacto</a>.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Datos que podemos recopilar
          </h2>
          <ul className="list-disc pl-6">
            <li>
              Datos que nos facilites al contactar (por ejemplo: nombre, email y
              mensaje).
            </li>
            <li>
              Datos técnicos mínimos de navegación (por ejemplo: IP, navegador)
              únicamente con fines de seguridad y funcionamiento del servicio.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Finalidad
          </h2>
          <ul className="list-disc pl-6">
            <li>Responder a consultas y solicitudes.</li>
            <li>Gestionar comunicaciones relacionadas con la actividad del Club.</li>
            <li>Garantizar el funcionamiento y la seguridad del sitio.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Base legal
          </h2>
          <p>
            El tratamiento se basa en el consentimiento del usuario al enviar
            comunicaciones y, cuando aplique, en el interés legítimo para
            garantizar la seguridad y el funcionamiento del sitio.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Conservación
          </h2>
          <p>
            Conservaremos los datos el tiempo necesario para responder y, en su
            caso, gestionar la relación derivada de la consulta. Posteriormente
            podrán conservarse bloqueados durante los plazos legalmente exigibles.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Cesiones a terceros
          </h2>
          <p>
            No cedemos datos personales a terceros salvo obligación legal o cuando
            sea necesario para prestar un servicio (por ejemplo, proveedores
            técnicos que alojan la web).
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Derechos
          </h2>
          <p>
            Puedes solicitar el acceso, rectificación, supresión, oposición o
            limitación del tratamiento de tus datos contactando con nosotros a
            través de la página de <a href="/contacto">Contacto</a>.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-primary">
            Cambios
          </h2>
          <p>
            Esta política puede actualizarse para reflejar cambios legales o
            técnicos. Recomendamos revisarla periódicamente.
          </p>
        </div>
      </Container>
    </main>
  );
}
