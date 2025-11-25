"use client";

import { useState, useMemo } from "react";
import { berekenIsolatie, IsolatieInput } from "@/lib/calculations/isolatie";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function IsolatieCalculator() {
  const [input, setInput] = useState<IsolatieInput>({
    woningType: "tussenwoning",
    gasVerbruik: 1200,
    maatregelen: [],
    huidigGlasType: "dubbel",
    gasPrijs: 1.2,
    investeringsKosten: {},
  });

  const result = useMemo(() => {
    try {
      return berekenIsolatie(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  const toggleMaatregel = (maatregel: "dak" | "spouw" | "vloer" | "glas") => {
    setInput({
      ...input,
      maatregelen: input.maatregelen.includes(maatregel)
        ? input.maatregelen.filter((m) => m !== maatregel)
        : [...input.maatregelen, maatregel],
    });
  };

  return (
    <CalculatorLayout
      tool="isolatie"
      title="Isolatie Calculator"
      description="Bereken je besparing met isolatiemaatregelen"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
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
                label="Bouwjaar (optioneel)"
                name="bouwjaar"
                type="number"
                value={input.bouwjaar || ""}
                onChange={(val) => setInput({ ...input, bouwjaar: val ? Number(val) : undefined })}
                min={1900}
                max={new Date().getFullYear()}
                step={1}
                unit=""
                helpText="Voor automatische bepaling huidige isolatiestatus"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Te isoleren onderdelen
                </label>
                <div className="space-y-2">
                  {(["dak", "spouw", "vloer", "glas"] as const).map((maatregel) => (
                    <label key={maatregel} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={input.maatregelen.includes(maatregel)}
                        onChange={() => toggleMaatregel(maatregel)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {maatregel === "spouw"
                          ? "Spouwmuur"
                          : maatregel === "glas"
                            ? "HR++ glas"
                            : maatregel}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {input.maatregelen.includes("dak") && (
                <SelectField
                  label="Huidige dakisolatie"
                  name="huidigeIsolatieDak"
                  value={input.huidigeIsolatieDak || "geen"}
                  onChange={(val) => setInput({ ...input, huidigeIsolatieDak: val as any })}
                  options={[
                    { value: "geen", label: "Geen isolatie" },
                    { value: "matig", label: "Matige isolatie" },
                    { value: "goed", label: "Goede isolatie" },
                  ]}
                />
              )}

              {input.maatregelen.includes("spouw") && (
                <SelectField
                  label="Huidige spouwmuurisolatie"
                  name="huidigeIsolatieSpouw"
                  value={input.huidigeIsolatieSpouw || "geen"}
                  onChange={(val) => setInput({ ...input, huidigeIsolatieSpouw: val as any })}
                  options={[
                    { value: "geen", label: "Geen isolatie" },
                    { value: "matig", label: "Matige isolatie" },
                    { value: "goed", label: "Goede isolatie" },
                  ]}
                />
              )}

              {input.maatregelen.includes("vloer") && (
                <SelectField
                  label="Huidige vloerisolatie"
                  name="huidigeIsolatieVloer"
                  value={input.huidigeIsolatieVloer || "geen"}
                  onChange={(val) => setInput({ ...input, huidigeIsolatieVloer: val as any })}
                  options={[
                    { value: "geen", label: "Geen isolatie" },
                    { value: "matig", label: "Matige isolatie" },
                    { value: "goed", label: "Goede isolatie" },
                  ]}
                />
              )}

              {input.maatregelen.includes("glas") && (
                <SelectField
                  label="Huidig glastype"
                  name="huidigGlasType"
                  value={input.huidigGlasType ?? "dubbel"}
                  onChange={(val) => setInput({ ...input, huidigGlasType: val as any })}
                  options={[
                    { value: "enkel", label: "Enkel glas" },
                    { value: "dubbel", label: "Dubbel glas" },
                    { value: "hr", label: "HR glas" },
                  ]}
                />
              )}

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

              {input.maatregelen.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Investeringskosten (optioneel)</h3>
                  <div className="space-y-3">
                    {input.maatregelen.map((maatregel) => (
                      <InputField
                        key={maatregel}
                        label={`${maatregel === "spouw" ? "Spouwmuur" : maatregel === "glas" ? "HR++ glas" : maatregel} isolatie`}
                        name={`investeringsKosten_${maatregel}`}
                        type="number"
                        value={input.investeringsKosten?.[maatregel] || ""}
                        onChange={(val) =>
                          setInput({
                            ...input,
                            investeringsKosten: {
                              ...input.investeringsKosten,
                              [maatregel]: val ? Number(val) : undefined,
                            },
                          })
                        }
                        min={0}
                        step={100}
                        unit="€"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result && result.maatregelen.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Totaal gasbesparing"
                  value={result.totaalGasBesparing}
                  unit="m³/jaar"
                  variant="success"
                />

                <ResultCard
                  title="Totaal kostenbesparing"
                  value={result.totaalKostenBesparing}
                  unit="€/jaar"
                  variant="success"
                />

                <ResultCard
                  title="CO₂ reductie"
                  value={result.totaalCo2Reductie}
                  unit="kg/jaar"
                  variant="info"
                />

                <ResultCard
                  title="Nieuw gasverbruik"
                  value={result.nieuwGasVerbruik}
                  unit="m³/jaar"
                  variant="info"
                />
              </div>

              {result.totaalInvesteringsKosten && (
                <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Totaal investeringskosten</h3>
                  <p className="text-2xl font-bold text-totaaladvies-blue">
                    €{result.totaalInvesteringsKosten.toLocaleString("nl-NL")}
                  </p>
                </div>
              )}

              {result.prioriteitAdvies && result.prioriteitAdvies.length > 1 && (
                <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prioriteit advies</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Maatregelen gesorteerd op impact (gasbesparing per geïnvesteerde euro):
                  </p>
                  <div className="space-y-3">
                    {result.prioriteitAdvies.map((advies, index) => (
                      <div
                        key={advies.maatregel}
                        className={`border rounded-lg p-4 ${
                          index === 0
                            ? "border-green-500 bg-green-50"
                            : index === 1
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {index + 1}. {advies.maatregel === "spouw"
                              ? "Spouwmuur"
                              : advies.maatregel === "glas"
                                ? "HR++ glas"
                                : advies.maatregel}
                          </h4>
                          {index === 0 && (
                            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded">
                              Beste keuze
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Gasbesparing: {advies.gasBesparing} m³/jaar</p>
                          <p>Kostenbesparing: €{advies.kostenBesparing.toFixed(2)}/jaar</p>
                          <p>Investering: €{advies.investeringsKosten.toLocaleString("nl-NL")}</p>
                          {advies.terugverdientijd > 0 && (
                            <p>Terugverdientijd: {advies.terugverdientijd} jaar</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.maatregelen.length > 1 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Let op:</strong> Bij meerdere maatregelen is de totale besparing lager dan de som
                    van individuele besparingen (combinatie-effect). De berekening houdt hier rekening mee.
                  </p>
                </div>
              )}

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Per maatregel</h3>
                <div className="space-y-3">
                  {result.maatregelen.map((m) => (
                    <div key={m.maatregel} className="border-b border-gray-200 pb-3 last:border-0">
                      <h4 className="font-medium text-gray-900 capitalize mb-1">
                        {m.maatregel === "spouw"
                          ? "Spouwmuur"
                          : m.maatregel === "glas"
                            ? "HR++ glas"
                            : m.maatregel}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Gasbesparing: {m.gasBesparing} m³/jaar</p>
                        <p>Kostenbesparing: €{m.kostenBesparing.toFixed(2)}/jaar</p>
                        <p>CO₂ reductie: {m.co2Reductie} kg/jaar</p>
                        {m.investeringsKosten && (
                          <p>Investering: €{m.investeringsKosten.toLocaleString("nl-NL")}</p>
                        )}
                        {m.terugverdientijd && (
                          <p className="font-semibold text-totaaladvies-blue">
                            Terugverdientijd: {m.terugverdientijd} jaar
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <LeadForm tool="isolatie" results={result} />
            </>
          )}

          {result && result.maatregelen.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 lg:p-8">
              <p className="text-yellow-800">
                Selecteer minimaal één isolatiemaatregel om de berekening te zien.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
