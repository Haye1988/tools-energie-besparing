"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenCvKetel, CvKetelInput } from "@/lib/calculations/cv-ketel";
import { cvKetelSchema, CvKetelFormData } from "@/lib/validations/cv-ketel.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function CvKetelCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<CvKetelFormData>({
    resolver: zodResolver(cvKetelSchema),
    defaultValues: {
      gasVerbruik: 1200,
      huidigKetelType: "redelijk",
      aantalPersonen: 4,
      gewenstSysteem: "hr-ketel",
      gasPrijs: 1.2,
      stroomPrijs: 0.27,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: CvKetelInput = {
        gasVerbruik: formValues.gasVerbruik,
        huidigKetelType: formValues.huidigKetelType,
        aantalPersonen: formValues.aantalPersonen,
        gewenstSysteem: formValues.gewenstSysteem,
        gasPrijs: formValues.gasPrijs,
        stroomPrijs: formValues.stroomPrijs,
        ketelLeeftijd: formValues.ketelLeeftijd,
        installatieKosten: formValues.installatieKosten,
      };
      return berekenCvKetel(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

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

              <SelectFieldRHF
                label="Type huidige ketel"
                name="huidigKetelType"
                register={register("huidigKetelType")}
                error={errors.huidigKetelType}
                options={[
                  { value: "oud", label: "Oud (voor 1995, geen HR)" },
                  { value: "redelijk", label: "Redelijk (±2005, HR)" },
                  { value: "nieuw", label: "Nieuw (na 2015, HR+)" },
                ]}
                required
              />

              <InputFieldRHF
                label="Aantal personen"
                name="aantalPersonen"
                type="number"
                register={register("aantalPersonen", { valueAsNumber: true })}
                error={errors.aantalPersonen}
                min={1}
                max={10}
                step={1}
                unit="personen"
                required
              />

              <SelectFieldRHF
                label="Gewenst systeem"
                name="gewenstSysteem"
                register={register("gewenstSysteem")}
                error={errors.gewenstSysteem}
                options={[
                  { value: "hr-ketel", label: "Nieuwe HR-ketel" },
                  { value: "hybride", label: "Hybride warmtepomp + ketel" },
                ]}
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
                label="Stroomprijs"
                name="stroomPrijs"
                type="number"
                register={register("stroomPrijs", { valueAsNumber: true })}
                error={errors.stroomPrijs}
                min={0}
                step={0.01}
                unit="€/kWh"
                defaultValue={0.27}
              />

              <InputFieldRHF
                label="Ketelleeftijd (jaren)"
                name="ketelLeeftijd"
                type="number"
                register={register("ketelLeeftijd", { valueAsNumber: true })}
                error={errors.ketelLeeftijd}
                min={0}
                max={50}
                step={1}
                unit="jaar"
                helpText="Voor vervangingsadvies (advies na 15 jaar)"
              />

              <InputFieldRHF
                label="Installatiekosten (optioneel)"
                name="installatieKosten"
                type="number"
                register={register("installatieKosten", { valueAsNumber: true })}
                error={errors.installatieKosten}
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
