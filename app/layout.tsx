import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Julia Lizarazu - Portfolio",
  description:
    "Técnica en Programación (UTN) - Assistant Manager en Proyectos Digitales - QA - IA",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Julia Lizarazu - Portfolio",
    description: "Perfil técnico-profesional con IA integrada",
    url: "https://mi-portafolio-julia-lizarazu.vercel.app",
    siteName: "Julia Lizarazu",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
