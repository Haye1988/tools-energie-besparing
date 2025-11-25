import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { StrictMode } from "react";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
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
        <ErrorBoundary>
          {process.env.NODE_ENV === "development" ? <StrictMode>{children}</StrictMode> : children}
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
