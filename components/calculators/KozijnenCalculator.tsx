"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenKozijnen, KozijnenInput } from "@/lib/calculations/kozijnen";
import { kozijnenSchema, KozijnenFormData } from "@/lib/validations/kozijnen.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function KozijnenCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<KozijnenFormData>({
    resolver: zodResolver(kozijnenSchema),
    defaultValues: {
      oppervlakteRamen: 20,
      huidigGlasType: "dubbel",
      kozijnMateriaal: "kunststof",
      gasVerbruik: 1200,
      gasPrijs: 1.2,
      woningType: "tussenwoning",
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: KozijnenInput = {
        oppervlakteRamen: formValues.oppervlakteRamen,
        huidigGlasType: formValues.huidigGlasType,
        kozijnMateriaal: formValues.kozijnMateriaal,
        gasVerbruik: formValues.gasVerbruik,
        gasPrijs: formValues.gasPrijs,
        woningType: formValues.woningType,
        bouwjaar: formValues.bouwjaar,
        investeringsKosten: formValues.investeringsKosten,
      };
      return berekenKozijnen(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

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
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Oppervlakte ramen"
                name="oppervlakteRamen"
                type="number"
                register={register("oppervlakteRamen", { valueAsNumber: true })}
                error={errors.oppervlakteRamen}
                min={0}
                step={1}
                unit="m²"
                required
              />

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
                label="Bouwjaar (optioneel)"
                name="bouwjaar"
                type="number"
                register={register("bouwjaar", { valueAsNumber: true })}
                error={errors.bouwjaar}
                min={1900}
                max={new Date().getFullYear()}
                step={1}
                unit=""
                helpText="Voor automatische bepaling huidig glastype"
              />

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
                required
              />

              <SelectFieldRHF
                label="Kozijn materiaal"
                name="kozijnMateriaal"
                register={register("kozijnMateriaal")}
                error={errors.kozijnMateriaal}
                options={[
                  { value: "hout", label: "Hout" },
                  { value: "kunststof", label: "Kunststof" },
                  { value: "aluminium", label: "Aluminium" },
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

              <InputFieldRHF
                label="Investeringskosten (optioneel)"
                name="investeringsKosten"
                type="number"
                register={register("investeringsKosten", { valueAsNumber: true })}
                error={errors.investeringsKosten}
                min={0}
                step={100}
                unit="€"
                helpText={`Geschat: €${Math.round((formValues.oppervlakteRamen || 20) * 225).toLocaleString("nl-NL")} (€150-300 per m²)`}
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

              {result.investeringsKosten && (
                <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Investeringskosten</h3>
                  <p className="text-2xl font-bold text-totaaladvies-blue">
                    €{result.investeringsKosten.toLocaleString("nl-NL")}
                  </p>
                  {result.terugverdientijd && (
                    <p className="text-sm text-gray-600 mt-2">
                      Terugverdientijd: {result.terugverdientijd} jaar
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comfort verbetering</h3>
                <p className="text-gray-700">{result.comfortVerbetering}</p>
              </div>

              <LeadForm tool="kozijnen" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
