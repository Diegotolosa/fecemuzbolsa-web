import Container from "../../components/container";

export default function LegalPage() {
  return (
    <main className="page-y">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Aviso legal
        </h1>

        <div className="mt-6 max-w-4xl space-y-4 text-justify text-slate-600">
          <p>
            FECEMUZ Bolsa es una asociación estudiantil vinculada a la Universidad
            de Zaragoza, inscrita en el Registro de Asociaciones correspondiente.
          </p>

          <p>
            El contenido de este sitio web tiene carácter exclusivamente
            informativo y formativo. En ningún caso constituye asesoramiento
            financiero ni recomendación de inversión.
          </p>

          <p>
            FECEMUZ Bolsa no se hace responsable del uso que terceros puedan hacer
            de la información publicada en este sitio.
          </p>

          <p>
            Para cualquier consulta o comunicación, puedes contactar con nosotros
            a través de la sección de{" "}
            <a href="/contacto">Contacto</a>.
          </p>
        </div>
      </Container>
    </main>
  );
}
