import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  beforeSend(event) {
    // Add additional context before sending
    if (event.contexts) {
      event.contexts.browser = {
        ...event.contexts.browser,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      };
    }
    return event;
  },
  beforeBreadcrumb(breadcrumb) {
    // Filter out sensitive information from breadcrumbs
    if (breadcrumb.data) {
      // Remove potential sensitive data
      const sensitiveKeys = ["password", "token", "apiKey", "secret"];
      sensitiveKeys.forEach((key) => {
        if (breadcrumb.data?.[key]) {
          breadcrumb.data[key] = "[REDACTED]";
        }
      });
    }
    return breadcrumb;
  },
  // Replay integration is optioneel en alleen beschikbaar in bepaalde versies
  // replaysOnErrorSampleRate: 1.0,
  // replaysSessionSampleRate: 0.1,
});
