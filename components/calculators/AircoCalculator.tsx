"use client";

import { useState, useMemo } from "react";
import { berekenAirco, AircoInput } from "@/lib/calculations/airco";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function AircoCalculator() {
  const [input, setInput] = useState<AircoInput>({
    oppervlakte: 25,
    hoogte: 2.5,
    isolatieNiveau: "gemiddeld",
    toepassing: "koelen",
    koelurenPerJaar: 720,
    stroomPrijs: 0.27,
  });

  const result = useMemo(() => {
    try {
      return berekenAirco(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="airco"
      title="Airco Calculator"
      description="Bereken het benodigde koelvermogen voor jouw ruimte"
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
                label="Oppervlakte ruimte"
                name="oppervlakte"
                type="number"
                value={input.oppervlakte}
                onChange={(val) => setInput({ ...input, oppervlakte: Number(val) })}
                min={0}
                step={1}
                unit="m²"
              />
              
              <InputField
                label="Plafondhoogte"
                name="hoogte"
                type="number"
                value={input.hoogte}
                onChange={(val) => setInput({ ...input, hoogte: Number(val) })}
                min={2}
                max={5}
                step={0.1}
                unit="m"
              />
              
              <SelectField
                label="Isolatieniveau"
                name="isolatieNiveau"
                value={input.isolatieNiveau}
                onChange={(val) => setInput({ ...input, isolatieNiveau: val as any })}
                options={[
                  { value: "goed", label: "Goed geïsoleerd" },
                  { value: "gemiddeld", label: "Gemiddeld" },
                  { value: "slecht", label: "Slecht geïsoleerd / veel ramen" },
                ]}
              />
              
              <SelectField
                label="Toepassing"
                name="toepassing"
                value={input.toepassing}
                onChange={(val) => setInput({ ...input, toepassing: val as any })}
                options={[
                  { value: "koelen", label: "Alleen koelen" },
                  { value: "koelen-verwarmen", label: "Koelen + verwarmen" },
                ]}
              />
              
              <InputField
                label="Koeluren per jaar"
                name="koelurenPerJaar"
                type="number"
                value={input.koelurenPerJaar ?? 720}
                onChange={(val) => setInput({ ...input, koelurenPerJaar: Number(val) })}
                min={0}
                step={100}
                unit="uren"
              />
              
              <InputField
                label="Stroomprijs"
                name="stroomPrijs"
                type="number"
                value={input.stroomPrijs ?? 0.27}
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
                  title="Benodigd vermogen"
                  value={Math.round(result.benodigdVermogenBTU / 1000)}
                  unit="k BTU"
                  variant="info"
                />
                
                <ResultCard
                  title="Jaarlijks verbruik"
                  value={result.jaarlijksVerbruik}
                  unit="kWh"
                  variant="warning"
                />
                
                <ResultCard
                  title="Jaarlijkse kosten"
                  value={result.jaarlijkseKosten}
                  unit="€"
                  variant="warning"
                />
              </div>
              
              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Advies
                </h3>
                <p className="text-gray-700 mb-4">
                  {result.advies}
                </p>
                <p className="text-sm text-gray-600">
                  Ruimte inhoud: {result.ruimteInhoud} m³
                </p>
              </div>
              
              <LeadForm
                tool="airco"
                results={result}
              />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}

