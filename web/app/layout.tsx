import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: {
    default: "FECEMUZ Bolsa – Club universitario de inversión (UZ)",
    template: "%s | FECEMUZ Bolsa",
  },
  description:
    "FECEMUZ Bolsa es el club universitario de inversión de la Universidad de Zaragoza. Informes semanales y análisis de mercados financieros con fines formativos.",
  metadataBase: new URL("https://fecemuzbolsa.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FECEMUZ Bolsa – Club universitario de inversión (UZ)",
    description:
      "Club universitario de inversión de la Universidad de Zaragoza. Informes semanales y análisis de mercados financieros con fines educativos.",
    url: "https://fecemuzbolsa.com",
    siteName: "FECEMUZ Bolsa",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FECEMUZ Bolsa – Club universitario de inversión (UZ)",
    description:
      "Club universitario de inversión de la Universidad de Zaragoza. Informes semanales y análisis de mercados financieros con fines educativos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="min-h-[calc(100vh-64px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}







