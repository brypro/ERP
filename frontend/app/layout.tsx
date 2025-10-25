import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP - Taller Mecánico",
  description: "Sistema de gestión para taller mecánico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
