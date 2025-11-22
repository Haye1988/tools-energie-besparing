"use client";

import { useState, useMemo } from "react";
import { berekenKozijnen, KozijnenInput } from "@/lib/calculations/kozijnen";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function KozijnenCalculator() {
  const [input, setInput] = useState<KozijnenInput>({
    oppervlakteRamen: 20,
    huidigGlasType: "dubbel",
    kozijnMateriaal: "kunststof",
    gasVerbruik: 1200,
    gasPrijs: 1.20,
  });

  const result = useMemo(() => {
    try {
      return berekenKozijnen(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="kozijnen"
      title="Kozijnen Calculator"
      description="Bereken je besparing met nieuwe kozijnen en HR++ glas"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">
              Jouw gegevens
            </h2>
            
            <div className="space-y-5">
              <InputField
                label="Oppervlakte ramen"
                name="oppervlakteRamen"
                type="number"
                value={input.oppervlakteRamen}
                onChange={(val) => setInput({ ...input, oppervlakteRamen: Number(val) })}
                min={0}
                step={1}
                unit="m²"
              />
              
              <SelectField
                label="Huidig glastype"
                name="huidigGlasType"
                value={input.huidigGlasType}
                onChange={(val) => setInput({ ...input, huidigGlasType: val as any })}
                options={[
                  { value: "enkel", label: "Enkel glas" },
                  { value: "dubbel", label: "Dubbel glas" },
                  { value: "hr", label: "HR glas" },
                ]}
              />
              
              <SelectField
                label="Kozijn materiaal"
                name="kozijnMateriaal"
                value={input.kozijnMateriaal}
                onChange={(val) => setInput({ ...input, kozijnMateriaal: val as any })}
                options={[
                  { value: "hout", label: "Hout" },
                  { value: "kunststof", label: "Kunststof" },
                  { value: "aluminium", label: "Aluminium" },
                ]}
              />
              
              <InputField
                label="Jaarlijks gasverbruik"
                name="gasVerbruik"
                type="number"
                value={input.gasVerbruik}
                onChange={(val) => setInput({ ...input, gasVerbruik: Number(val) })}
                min={0}
                step={100}
                unit="m³/jaar"
              />
              
              <InputField
                label="Gasprijs"
                name="gasPrijs"
                type="number"
                value={input.gasPrijs}
                onChange={(val) => setInput({ ...input, gasPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/m³"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Huidige U-waarde"
                  value={result.huidigeUWaarde}
                  unit="W/m²K"
                  variant="warning"
                />
                
                <ResultCard
                  title="Nieuwe U-waarde"
                  value={result.nieuweUWaarde}
                  unit="W/m²K"
                  variant="success"
                />
                
                <ResultCard
                  title="Gasbesparing"
                  value={result.gasBesparing}
                  unit="m³/jaar"
                  variant="success"
                />
                
                <ResultCard
                  title="Kostenbesparing"
                  value={result.kostenBesparing}
                  unit="€/jaar"
                  variant="success"
                />
                
                <ResultCard
                  title="CO₂ reductie"
                  value={result.co2Reductie}
                  unit="kg/jaar"
                  variant="info"
                />
              </div>
              
              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comfort verbetering
                </h3>
                <p className="text-gray-700">
                  {result.comfortVerbetering}
                </p>
              </div>
              
              <LeadForm
                tool="kozijnen"
                results={result}
              />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}

