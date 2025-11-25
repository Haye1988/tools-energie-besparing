import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { StrictMode } from "react";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import PostHogProvider from "@/components/shared/PostHogProvider";
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
        <PostHogProvider>
          <ErrorBoundary>
            {process.env.NODE_ENV === "development" ? (
              <StrictMode>{children}</StrictMode>
            ) : (
              children
            )}
          </ErrorBoundary>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
