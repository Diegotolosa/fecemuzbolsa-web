import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export const metadata = {
  title: "FECEMUZ Bolsa",
  description: "FECEMUZ Bolsa — Learning by Doing",
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






