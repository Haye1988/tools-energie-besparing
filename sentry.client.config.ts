import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  // Replay integration is optioneel en alleen beschikbaar in bepaalde versies
  // replaysOnErrorSampleRate: 1.0,
  // replaysSessionSampleRate: 0.1,
});

