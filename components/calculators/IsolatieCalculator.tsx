"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenIsolatie, IsolatieInput } from "@/lib/calculations/isolatie";
import { isolatieSchema, IsolatieFormData } from "@/lib/validations/isolatie.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function IsolatieCalculator() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IsolatieFormData>({
    resolver: zodResolver(isolatieSchema),
    defaultValues: {
      woningType: "tussenwoning",
      gasVerbruik: 1200,
      maatregelen: [],
      huidigGlasType: "dubbel",
      gasPrijs: 1.2,
      investeringsKosten: {},
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: IsolatieInput = {
        woningType: formValues.woningType,
        gasVerbruik: formValues.gasVerbruik,
        maatregelen: formValues.maatregelen,
        huidigGlasType: formValues.huidigGlasType,
        gasPrijs: formValues.gasPrijs,
        bouwjaar: formValues.bouwjaar,
        huidigeIsolatieDak: formValues.huidigeIsolatieDak,
        huidigeIsolatieSpouw: formValues.huidigeIsolatieSpouw,
        huidigeIsolatieVloer: formValues.huidigeIsolatieVloer,
        investeringsKosten: formValues.investeringsKosten,
        subsidieBedrag: formValues.subsidieBedrag,
      };
      return berekenIsolatie(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

  const toggleMaatregel = (maatregel: "dak" | "spouw" | "vloer" | "glas") => {
    const currentMaatregelen = formValues.maatregelen || [];
    const newMaatregelen = currentMaatregelen.includes(maatregel)
      ? currentMaatregelen.filter((m) => m !== maatregel)
      : [...currentMaatregelen, maatregel];
    setValue("maatregelen", newMaatregelen);
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
              <SelectFieldRHF
                label="Woningtype"
                name="woningType"
                register={register("woningType")}
                error={errors.woningType}
                options={[
                  { value: "appartement", label: "Appartement" },
                  { value: "tussenwoning", label: "Tussenwoning" },
                  { value: "hoekwoning", label: "Hoekwoning" },
                  { value: "2-onder-1-kap", label: "2-onder-1-kap" },
                  { value: "vrijstaand", label: "Vrijstaand" },
                ]}
                required
              />

              <InputFieldRHF
                label="Jaarlijks gasverbruik"
                name="gasVerbruik"
                type="number"
                register={register("gasVerbruik", { valueAsNumber: true })}
                error={errors.gasVerbruik}
                min={0}
                step={100}
                unit="m³/jaar"
                required
              />

              <InputFieldRHF
                label="Bouwjaar (optioneel)"
                name="bouwjaar"
                type="number"
                register={register("bouwjaar", { valueAsNumber: true })}
                error={errors.bouwjaar}
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
                {errors.maatregelen && (
                  <p className="text-xs text-red-600 mb-2" role="alert">
                    {errors.maatregelen.message}
                  </p>
                )}
                <div className="space-y-2">
                  {(["dak", "spouw", "vloer", "glas"] as const).map((maatregel) => (
                    <label key={maatregel} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formValues.maatregelen || []).includes(maatregel)}
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

              {(formValues.maatregelen || []).includes("dak") && (
                <SelectFieldRHF
                  label="Huidige dakisolatie"
                  name="huidigeIsolatieDak"
                  register={register("huidigeIsolatieDak")}
                  error={errors.huidigeIsolatieDak}
                  options={[
                    { value: "geen", label: "Geen isolatie" },
                    { value: "matig", label: "Matige isolatie" },
                    { value: "goed", label: "Goede isolatie" },
                  ]}
                  defaultValue="geen"
                />
              )}

              {(formValues.maatregelen || []).includes("spouw") && (
                <SelectFieldRHF
                  label="Huidige spouwmuurisolatie"
                  name="huidigeIsolatieSpouw"
                  register={register("huidigeIsolatieSpouw")}
                  error={errors.huidigeIsolatieSpouw}
                  options={[
                    { value: "geen", label: "Geen isolatie" },
                    { value: "matig", label: "Matige isolatie" },
                    { value: "goed", label: "Goede isolatie" },
                  ]}
                  defaultValue="geen"
                />
              )}

              {(formValues.maatregelen || []).includes("vloer") && (
                <SelectFieldRHF
                  label="Huidige vloerisolatie"
                  name="huidigeIsolatieVloer"
                  register={register("huidigeIsolatieVloer")}
                  error={errors.huidigeIsolatieVloer}
                  options={[
                    { value: "geen", label: "Geen isolatie" },
                    { value: "matig", label: "Matige isolatie" },
                    { value: "goed", label: "Goede isolatie" },
                  ]}
                  defaultValue="geen"
                />
              )}

              {(formValues.maatregelen || []).includes("glas") && (
                <SelectFieldRHF
                  label="Huidig glastype"
                  name="huidigGlasType"
                  register={register("huidigGlasType")}
                  error={errors.huidigGlasType}
                  options={[
                    { value: "enkel", label: "Enkel glas" },
                    { value: "dubbel", label: "Dubbel glas" },
                    { value: "hr", label: "HR glas" },
                  ]}
                  defaultValue="dubbel"
                />
              )}

              <InputFieldRHF
                label="Gasprijs"
                name="gasPrijs"
                type="number"
                register={register("gasPrijs", { valueAsNumber: true })}
                error={errors.gasPrijs}
                min={0}
                step={0.01}
                unit="€/m³"
                defaultValue={1.2}
              />

              {(formValues.maatregelen || []).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Investeringskosten (optioneel)
                  </h3>
                  <div className="space-y-3">
                    {(formValues.maatregelen || []).map((maatregel) => (
                      <InputFieldRHF
                        key={maatregel}
                        label={`${maatregel === "spouw" ? "Spouwmuur" : maatregel === "glas" ? "HR++ glas" : maatregel} isolatie`}
                        name={`investeringsKosten.${maatregel}`}
                        type="number"
                        register={register(`investeringsKosten.${maatregel}` as any, {
                          valueAsNumber: true,
                        })}
                        error={errors.investeringsKosten?.[maatregel]}
                        min={0}
                        step={100}
                        unit="€"
                      />
                    ))}
                  </div>
                </div>
              )}

              {(formValues.maatregelen || []).length > 0 && (
                <InputFieldRHF
                  label="Subsidiebedrag (optioneel)"
                  name="subsidieBedrag"
                  type="number"
                  register={register("subsidieBedrag", { valueAsNumber: true })}
                  error={errors.subsidieBedrag}
                  min={0}
                  step={100}
                  unit="€"
                  helpText="Totaal subsidiebedrag voor alle maatregelen samen"
                />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Investeringskosten</h3>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-totaaladvies-blue">
                      €{result.totaalInvesteringsKosten.toLocaleString("nl-NL")}
                    </p>
                    {result.subsidieBedrag && result.subsidieBedrag > 0 && (
                      <div className="text-sm text-gray-600">
                        <p>Subsidie: -€{result.subsidieBedrag.toLocaleString("nl-NL")}</p>
                        {result.totaalNettoInvesteringsKosten && (
                          <p className="font-semibold text-green-600 mt-1">
                            Netto investering: €
                            {result.totaalNettoInvesteringsKosten.toLocaleString("nl-NL")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
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
                            {index + 1}.{" "}
                            {advies.maatregel === "spouw"
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
                    <strong>Let op:</strong> Bij meerdere maatregelen is de totale besparing lager
                    dan de som van individuele besparingen (combinatie-effect). De berekening houdt
                    hier rekening mee.
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
