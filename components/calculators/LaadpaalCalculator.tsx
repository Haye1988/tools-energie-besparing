"use client";

import { useState, useMemo } from "react";
import { berekenLaadpaal, LaadpaalInput } from "@/lib/calculations/laadpaal";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function LaadpaalCalculator() {
  const [input, setInput] = useState<LaadpaalInput>({
    accuCapaciteit: 60,
    gewensteLaadtijd: 8,
    huisaansluiting: "1-fase",
    zonnepanelen: false,
  });

  const result = useMemo(() => {
    try {
      return berekenLaadpaal(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="laadpaal"
      title="Laadpaal Calculator"
      description="Bereken het benodigde laadvermogen voor jouw elektrische auto"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
              <InputField
                label="Accucapaciteit auto"
                name="accuCapaciteit"
                type="number"
                value={input.accuCapaciteit}
                onChange={(val) => setInput({ ...input, accuCapaciteit: Number(val) })}
                min={0}
                step={5}
                unit="kWh"
              />

              <InputField
                label="Gewenste laadtijd"
                name="gewensteLaadtijd"
                type="number"
                value={input.gewensteLaadtijd}
                onChange={(val) => setInput({ ...input, gewensteLaadtijd: Number(val) })}
                min={1}
                max={24}
                step={1}
                unit="uren"
              />

              <SelectField
                label="Huisaansluiting"
                name="huisaansluiting"
                value={input.huisaansluiting}
                onChange={(val) => setInput({ ...input, huisaansluiting: val as any })}
                options={[
                  { value: "1-fase", label: "1-fase (230V)" },
                  { value: "3-fase", label: "3-fase (400V)" },
                ]}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="zonnepanelen"
                  checked={input.zonnepanelen}
                  onChange={(e) => setInput({ ...input, zonnepanelen: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="zonnepanelen" className="text-sm text-gray-700">
                  Ik heb zonnepanelen
                </label>
              </div>

              <InputField
                label="Dagtarief"
                name="dagTarief"
                type="number"
                value={input.dagTarief ?? 0.35}
                onChange={(val) => setInput({ ...input, dagTarief: Number(val) })}
                min={0}
                step={0.01}
                unit="€/kWh"
                helpText="Stroomprijs overdag (standaard €0.35/kWh)"
              />

              <InputField
                label="Nachttarief"
                name="nachtTarief"
                type="number"
                value={input.nachtTarief ?? 0.2}
                onChange={(val) => setInput({ ...input, nachtTarief: Number(val) })}
                min={0}
                step={0.01}
                unit="€/kWh"
                helpText="Stroomprijs 's nachts (standaard €0.20/kWh)"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dynamischContract"
                  checked={input.dynamischContract ?? false}
                  onChange={(e) => setInput({ ...input, dynamischContract: e.target.checked })}
                  className="w-4 h-4 text-totaaladvies-orange border-gray-300 rounded focus:ring-totaaladvies-orange"
                />
                <label
                  htmlFor="dynamischContract"
                  className="text-sm font-medium text-totaaladvies-gray-medium"
                >
                  Dynamisch contract (variabele tarieven)
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Advies vermogen"
                  value={result.adviesVermogen}
                  unit="kW"
                  variant="info"
                />

                <ResultCard
                  title="Laadtijd bij advies"
                  value={result.laadtijdBijAdvies}
                  unit="uren"
                  variant="info"
                />

                <ResultCard
                  title="Kosten per lading"
                  value={result.kostenPerLading}
                  unit="€"
                  variant="warning"
                />
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Laadtijden bij verschillende vermogens
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Bij 3,7 kW: {result.laadtijdBij3_7kW.toFixed(1)} uur</p>
                  <p>Bij 7,4 kW: {result.laadtijdBij7_4kW.toFixed(1)} uur</p>
                  <p>Bij 11 kW: {result.laadtijdBij11kW.toFixed(1)} uur</p>
                </div>
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advies</h3>
                <p className="text-gray-700">{result.advies}</p>
              </div>

              <LeadForm tool="laadpaal" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
