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
    gasPrijs: 1.2,
    stroomPrijs: 0.27,
    cop: 4,
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
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

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

              <InputField
                label="COP (Coefficient of Performance)"
                name="cop"
                type="number"
                value={input.cop || 4}
                onChange={(val) => setInput({ ...input, cop: Number(val) })}
                min={3}
                max={5}
                step={0.1}
                unit=""
                helpText="Moderne warmtepompen hebben een COP van 3-5. Standaard: 4"
              />

              <InputField
                label="Installatiekosten (optioneel)"
                name="installatieKosten"
                type="number"
                value={input.installatieKosten || ""}
                onChange={(val) => setInput({ ...input, installatieKosten: val ? Number(val) : undefined })}
                min={0}
                step={1000}
                unit="€"
                helpText="Voor berekening terugverdientijd"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultaat</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Huidige kosten:</strong> €
                    {result.huidigeKosten.toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /jaar
                  </p>
                  <p>
                    <strong>Nieuwe kosten:</strong> €
                    {result.nieuweKosten.toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /jaar
                  </p>
                  <p>
                    <strong>Besparing:</strong> €
                    {result.nettoBesparing.toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /jaar
                  </p>
                  <p>
                    <strong>Gasbesparing:</strong> {result.gasBesparing} m³/jaar (
                    {result.co2Reductie} kg CO₂ minder)
                  </p>
                  {result.terugverdientijd && (
                    <p>
                      <strong>Terugverdientijd:</strong> {result.terugverdientijd} jaar
                    </p>
                  )}
                </div>
              </div>

              {result.scenarioRange && (
                <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario&apos;s</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Vermogen (kW)</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-green-700 font-medium">Optimistisch</div>
                          <div className="text-green-900 text-lg font-bold">
                            {result.scenarioRange.vermogen.optimistisch}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-blue-700 font-medium">Normaal</div>
                          <div className="text-blue-900 text-lg font-bold">
                            {result.scenarioRange.vermogen.normaal}
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <div className="text-orange-700 font-medium">Pessimistisch</div>
                          <div className="text-orange-900 text-lg font-bold">
                            {result.scenarioRange.vermogen.pessimistisch}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Besparing (€/jaar)</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-green-700 font-medium">Optimistisch</div>
                          <div className="text-green-900 text-lg font-bold">
                            €{result.scenarioRange.besparing.optimistisch.toLocaleString("nl-NL", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-blue-700 font-medium">Normaal</div>
                          <div className="text-blue-900 text-lg font-bold">
                            €{result.scenarioRange.besparing.normaal.toLocaleString("nl-NL", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <div className="text-orange-700 font-medium">Pessimistisch</div>
                          <div className="text-orange-900 text-lg font-bold">
                            €{result.scenarioRange.besparing.pessimistisch.toLocaleString("nl-NL", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <LeadForm tool="warmtepomp" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
