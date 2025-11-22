"use client";

import { useState, useMemo } from "react";
import { berekenBoilers, BoilersInput } from "@/lib/calculations/boilers";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function BoilersCalculator() {
  const [input, setInput] = useState<BoilersInput>({
    aantalPersonen: 4,
    warmwaterBehoefte: "gemiddeld",
    huidigSysteem: "cv-boiler",
    stroomPrijs: 0.27,
    gasPrijs: 1.2,
  });

  const result = useMemo(() => {
    try {
      return berekenBoilers(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="boilers"
      title="Boilers Calculator"
      description="Bereken het benodigde boilervermogen en besparing"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
              <InputField
                label="Aantal personen"
                name="aantalPersonen"
                type="number"
                value={input.aantalPersonen}
                onChange={(val) => setInput({ ...input, aantalPersonen: Number(val) })}
                min={1}
                max={10}
                step={1}
                unit="personen"
              />

              <SelectField
                label="Warmwater behoefte"
                name="warmwaterBehoefte"
                value={input.warmwaterBehoefte ?? "gemiddeld"}
                onChange={(val) => setInput({ ...input, warmwaterBehoefte: val as any })}
                options={[
                  { value: "laag", label: "Laag" },
                  { value: "gemiddeld", label: "Gemiddeld" },
                  { value: "hoog", label: "Hoog" },
                ]}
              />

              <SelectField
                label="Huidig systeem"
                name="huidigSysteem"
                value={input.huidigSysteem}
                onChange={(val) => setInput({ ...input, huidigSysteem: val as any })}
                options={[
                  { value: "cv-boiler", label: "CV-boiler" },
                  { value: "elektrisch", label: "Elektrische boiler" },
                  { value: "geen", label: "Geen boiler" },
                ]}
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

              <InputField
                label="Gasprijs"
                name="gasPrijs"
                type="number"
                value={input.gasPrijs ?? 1.2}
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
                  title="Aanbevolen volume"
                  value={result.aanbevolenVolume}
                  unit="liter"
                  variant="info"
                />

                <ResultCard
                  title="Aanbevolen vermogen"
                  value={result.aanbevolenVermogen}
                  unit="kW"
                  variant="info"
                />

                <ResultCard
                  title="Jaarlijkse kosten"
                  value={result.jaarlijkseKosten}
                  unit="€"
                  variant="warning"
                />

                {result.besparingVsCv && result.besparingVsCv > 0 && (
                  <ResultCard
                    title="Besparing vs CV"
                    value={result.besparingVsCv}
                    unit="€/jaar"
                    variant="success"
                  />
                )}
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advies</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Type:</strong>{" "}
                    {result.typeAdvies === "warmtepomp" ? "Warmtepompboiler" : "Elektrische boiler"}
                  </p>
                  <p>
                    <strong>Volume:</strong> {result.aanbevolenVolume} liter
                  </p>
                  <p>
                    <strong>Vermogen:</strong> {result.aanbevolenVermogen} kW
                  </p>
                  <p>
                    <strong>Jaarlijks verbruik:</strong> {result.jaarlijksVerbruik} kWh
                  </p>
                  <p>
                    <strong>Jaarlijkse kosten:</strong> €{result.jaarlijkseKosten.toFixed(2)}
                  </p>
                </div>
                <p className="mt-4 text-gray-700">{result.advies}</p>
              </div>

              <LeadForm tool="boilers" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
