"use client";

import { useState, useMemo } from "react";
import { berekenWarmtepomp, WarmtepompInput } from "@/lib/calculations/warmtepomp";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function WarmtepompCalculator() {
  const [input, setInput] = useState<WarmtepompInput>({
    gasVerbruik: 1200,
    woningType: "tussenwoning",
    isolatieNiveau: "matig",
    warmtepompType: "hybride",
    gasPrijs: 1.20,
    stroomPrijs: 0.27,
  });

  const result = useMemo(() => {
    try {
      return berekenWarmtepomp(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="warmtepomp"
      title="Warmtepomp Calculator"
      description="Bereken je besparing met een warmtepomp"
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
                label="Jaarlijks gasverbruik"
                name="gasVerbruik"
                type="number"
                value={input.gasVerbruik}
                onChange={(val) => setInput({ ...input, gasVerbruik: Number(val) })}
                min={0}
                step={100}
                unit="m³/jaar"
              />
              
              <SelectField
                label="Woningtype"
                name="woningType"
                value={input.woningType}
                onChange={(val) => setInput({ ...input, woningType: val as any })}
                options={[
                  { value: "appartement", label: "Appartement" },
                  { value: "tussenwoning", label: "Tussenwoning" },
                  { value: "hoekwoning", label: "Hoekwoning" },
                  { value: "2-onder-1-kap", label: "2-onder-1-kap" },
                  { value: "vrijstaand", label: "Vrijstaand" },
                ]}
              />
              
              <SelectField
                label="Isolatieniveau"
                name="isolatieNiveau"
                value={input.isolatieNiveau}
                onChange={(val) => setInput({ ...input, isolatieNiveau: val as any })}
                options={[
                  { value: "slecht", label: "Slecht" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
              />
              
              <SelectField
                label="Warmtepomp type"
                name="warmtepompType"
                value={input.warmtepompType}
                onChange={(val) => setInput({ ...input, warmtepompType: val as any })}
                options={[
                  { value: "hybride", label: "Hybride (met CV-ketel)" },
                  { value: "all-electric", label: "All-electric" },
                ]}
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
              
              <InputField
                label="Stroomprijs"
                name="stroomPrijs"
                type="number"
                value={input.stroomPrijs}
                onChange={(val) => setInput({ ...input, stroomPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/kWh"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Benodigd vermogen"
                  value={result.benodigdVermogen}
                  unit="kW"
                  variant="info"
                />
                
                <ResultCard
                  title="Stroomverbruik"
                  value={result.stroomVerbruik}
                  unit="kWh/jaar"
                  variant="info"
                />
                
                {result.restGasVerbruik > 0 && (
                  <ResultCard
                    title="Rest gasverbruik"
                    value={result.restGasVerbruik}
                    unit="m³/jaar"
                    variant="warning"
                  />
                )}
                
                <ResultCard
                  title="Netto besparing"
                  value={result.nettoBesparing}
                  unit="€/jaar"
                  variant={result.nettoBesparing > 0 ? "success" : "warning"}
                />
              </div>
              
              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resultaat
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Huidige kosten:</strong> €{result.huidigeKosten.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/jaar
                  </p>
                  <p>
                    <strong>Nieuwe kosten:</strong> €{result.nieuweKosten.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/jaar
                  </p>
                  <p>
                    <strong>Besparing:</strong> €{result.nettoBesparing.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/jaar
                  </p>
                  <p>
                    <strong>Gasbesparing:</strong> {result.gasBesparing} m³/jaar ({result.co2Reductie} kg CO₂ minder)
                  </p>
                </div>
              </div>
              
              <LeadForm
                tool="warmtepomp"
                results={result}
              />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}

