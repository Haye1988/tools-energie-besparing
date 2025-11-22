"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { isEmbedMode } from "@/lib/utils";
import EmbedWrapper from "./EmbedWrapper";
import AIChat from "./AIChat";
import { ToolName } from "@/types/calculator";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface CalculatorLayoutProps {
  tool: ToolName;
  title: string;
  description?: string;
  children: ReactNode;
  context?: Record<string, any>;
}

export default function CalculatorLayout({
  tool,
  title,
  description,
  children,
  context = {},
}: CalculatorLayoutProps) {
  const embed = isEmbedMode();

  return (
    <EmbedWrapper>
      <div className="min-h-screen bg-gradient-primary">
        {!embed && (
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="container mx-auto max-w-container px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <Image
                    src="/totaaladvies-logo.png"
                    alt="Totaaladvies"
                    width={180}
                    height={40}
                    className="h-8 w-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </header>
        )}
        
        <div className="container mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {!embed && (
            <>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-totaaladvies-blue hover:text-totaal-orange transition-colors mb-6 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Terug naar overzicht</span>
              </Link>
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-totaaladvies-blue mb-4">
                  {title}
                </h1>
                {description && (
                  <p className="text-lg md:text-xl text-totaaladvies-gray-medium max-w-2xl mx-auto">
                    {description}
                  </p>
                )}
              </div>
            </>
          )}
          
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
      
      {!embed && <AIChat tool={tool} context={context} />}
    </EmbedWrapper>
  );
}

