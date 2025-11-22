"use client";

import { useEffect } from "react";
import { isEmbedMode, sendHeightToParent } from "@/lib/utils";

interface EmbedWrapperProps {
  children: React.ReactNode;
}

export default function EmbedWrapper({ children }: EmbedWrapperProps) {
  const embed = isEmbedMode();

  useEffect(() => {
    if (embed) {
      // Send initial height
      sendHeightToParent();

      // Send height on resize
      const resizeObserver = new ResizeObserver(() => {
        sendHeightToParent();
      });

      resizeObserver.observe(document.documentElement);

      // Also listen to window resize
      window.addEventListener("resize", sendHeightToParent);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", sendHeightToParent);
      };
    }
    // Return undefined if not in embed mode
    return undefined;
  }, [embed]);

  return <div className={embed ? "bg-transparent" : ""}>{children}</div>;
}
