import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "../sentry.client.config";

export const metadata: Metadata = {
  title: "Energie Besparing Tools - Totaaladvies.nl",
  description: "Bereken je energiebesparing met onze interactieve tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

