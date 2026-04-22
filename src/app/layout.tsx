import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "APP Thompson",
  description: "Register, login, dasboard",
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
