import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat("nl-NL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(num: number, decimals: number = 1): string {
  return `${formatNumber(num, decimals)}%`;
}

export function isEmbedMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("embed") === "true";
}

export function sendHeightToParent() {
  if (typeof window === "undefined") return;
  if (window.parent === window) return; // Not in iframe
  
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage(
    { type: "resize", height },
    "*"
  );
}

