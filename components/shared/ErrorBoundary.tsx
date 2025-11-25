"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Add breadcrumb for error context
    Sentry.addBreadcrumb({
      category: "error-boundary",
      message: "Error caught by ErrorBoundary",
      level: "error",
      data: {
        componentStack: errorInfo.componentStack,
        errorMessage: error.message,
        errorName: error.name,
      },
    });

    // Log error to Sentry with enhanced context
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        browser: {
          url: typeof window !== "undefined" ? window.location.href : undefined,
          userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        },
      },
      tags: {
        errorBoundary: true,
        errorType: error.name,
      },
      extra: {
        errorInfo,
        timestamp: new Date().toISOString(),
      },
    });

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Er is iets misgegaan</h1>
            <p className="text-gray-600 mb-6">
              Sorry, er is een fout opgetreden. Probeer de pagina te verversen of neem contact op
              als het probleem aanhoudt.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-totaaladvies-orange text-white px-4 py-2 rounded-lg hover:bg-totaaladvies-orange/90 transition-colors"
              >
                Pagina verversen
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Terug naar overzicht
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Technische details (alleen zichtbaar in development)
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
