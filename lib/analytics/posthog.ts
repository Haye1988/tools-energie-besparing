"use client";

import posthog from "posthog-js";

let posthogInitialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || posthogInitialized) return;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!posthogKey) {
    console.warn("PostHog key not found. Analytics will be disabled.");
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    loaded: () => {
      if (process.env.NODE_ENV === "development") {
        console.log("PostHog initialized");
      }
    },
    capture_pageview: true,
    capture_pageleave: true,
  });

  posthogInitialized = true;
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === "undefined" || !posthogInitialized) return;
  posthog.capture(eventName, properties);
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window === "undefined" || !posthogInitialized) return;
  posthog.identify(userId, properties);
}

export function resetUser() {
  if (typeof window === "undefined" || !posthogInitialized) return;
  posthog.reset();
}
