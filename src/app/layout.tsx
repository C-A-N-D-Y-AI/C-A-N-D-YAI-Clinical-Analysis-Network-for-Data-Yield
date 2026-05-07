import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "C.A.N.D.Y — Clinical Analysis Network for Data Yield",
  description: "Plataforma de análisis clínico potenciada por inteligencia artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
