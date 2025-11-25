"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  source?: string;
  sourceUrl?: string;
  className?: string;
}

export default function InfoTooltip({ content, source, sourceUrl, className }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-totaaladvies-blue hover:text-totaaladvies-orange transition-colors"
        aria-label="Meer informatie"
      >
        <Info className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg left-0 top-6">
          <p className="text-sm text-gray-700 mb-2">{content}</p>
          {source && (
            <p className="text-xs text-gray-500">
              Bron:{" "}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-totaaladvies-blue hover:underline"
                >
                  {source}
                </a>
              ) : (
                source
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

