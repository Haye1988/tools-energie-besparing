"use client";

import { useState, useMemo } from "react";
import { berekenCvKetel, CvKetelInput } from "@/lib/calculations/cv-ketel";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function CvKetelCalculator() {
  const [input, setInput] = useState<CvKetelInput>({
    gasVerbruik: 1200,
    huidigKetelType: "redelijk",
    aantalPersonen: 4,
    gewenstSysteem: "hr-ketel",
    gasPrijs: 1.2,
    stroomPrijs: 0.27,
  });

  const result = useMemo(() => {
    try {
      return berekenCvKetel(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="cv-ketel"
      title="CV-Ketel Calculator"
      description="Bereken of ketelvervanging rendabel is"
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
                label="Type huidige ketel"
                name="huidigKetelType"
                value={input.huidigKetelType}
                onChange={(val) => setInput({ ...input, huidigKetelType: val as any })}
                options={[
                  { value: "oud", label: "Oud (voor 1995, geen HR)" },
                  { value: "redelijk", label: "Redelijk (±2005, HR)" },
                  { value: "nieuw", label: "Nieuw (na 2015, HR+)" },
                ]}
              />

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
                label="Gewenst systeem"
                name="gewenstSysteem"
                value={input.gewenstSysteem}
                onChange={(val) => setInput({ ...input, gewenstSysteem: val as any })}
                options={[
                  { value: "hr-ketel", label: "Nieuwe HR-ketel" },
                  { value: "hybride", label: "Hybride warmtepomp + ketel" },
                ]}
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
                label="Ketelleeftijd (jaren)"
                name="ketelLeeftijd"
                type="number"
                value={input.ketelLeeftijd || ""}
                onChange={(val) =>
                  setInput({ ...input, ketelLeeftijd: val ? Number(val) : undefined })
                }
                min={0}
                max={50}
                step={1}
                unit="jaar"
                helpText="Voor vervangingsadvies (advies na 15 jaar)"
              />

              <InputField
                label="Installatiekosten (optioneel)"
                name="installatieKosten"
                type="number"
                value={input.installatieKosten || ""}
                onChange={(val) =>
                  setInput({ ...input, installatieKosten: val ? Number(val) : undefined })
                }
                min={0}
                step={100}
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
                  title="Nieuw rendement"
                  value={result.nieuwRendement}
                  unit="%"
                  variant="info"
                />
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultaat</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Tapwater advies:</strong> {result.tapwaterAdvies}
                  </p>
                  <p>
                    <strong>Huidig rendement:</strong> {result.huidigRendement}%
                  </p>
                  <p>
                    <strong>Nieuw rendement:</strong> {result.nieuwRendement}%
                  </p>
                  <p>
                    <strong>Besparing:</strong> €{result.kostenBesparing.toFixed(2)}/jaar (
                    {result.gasBesparing} m³ gas minder)
                  </p>
                  {result.vervangingsAdvies && (
                    <p className="text-orange-600 font-semibold">
                      ⚠️ Vervangingsadvies: Uw ketel is ouder dan 15 jaar. Vervanging wordt
                      aanbevolen.
                    </p>
                  )}
                  {result.terugverdientijd && (
                    <p>
                      <strong>Terugverdientijd:</strong> {result.terugverdientijd} jaar
                    </p>
                  )}
                </div>

                {result.hybrideAdvies && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Hybride optie:</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Warmtepomp vermogen: {result.hybrideAdvies.warmtepompVermogen} kW</p>
                      <p>Gasbesparing: {result.hybrideAdvies.gasBesparing} m³/jaar</p>
                      <p>
                        Kostenbesparing: €{result.hybrideAdvies.kostenBesparing.toFixed(2)}/jaar
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <LeadForm tool="cv-ketel" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
