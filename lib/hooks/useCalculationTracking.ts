"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/posthog";
import { ToolName } from "@/types/calculator";

export function useCalculationTracking(tool: ToolName, result: any) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (result && !hasTrackedRef.current) {
      trackEvent("calculation_completed", {
        tool,
        hasResults: !!result,
        resultKeys: result ? Object.keys(result).length : 0,
      });
      hasTrackedRef.current = true;
    } else if (!result) {
      hasTrackedRef.current = false;
    }
  }, [result, tool]);
}
