"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenAirco, AircoInput } from "@/lib/calculations/airco";
import { aircoSchema, AircoFormData } from "@/lib/validations/airco.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function AircoCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<AircoFormData>({
    resolver: zodResolver(aircoSchema),
    defaultValues: {
      oppervlakte: 25,
      hoogte: 2.5,
      isolatieNiveau: "gemiddeld",
      toepassing: "koelen",
      koelurenPerJaar: 720,
      stroomPrijs: 0.27,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: AircoInput = {
        oppervlakte: formValues.oppervlakte,
        hoogte: formValues.hoogte,
        isolatieNiveau: formValues.isolatieNiveau,
        toepassing: formValues.toepassing,
        koelurenPerJaar: formValues.koelurenPerJaar,
        stroomPrijs: formValues.stroomPrijs,
        aantalPersonen: formValues.aantalPersonen,
        raamOppervlak: formValues.raamOppervlak,
        zonInstraling: formValues.zonInstraling,
        aantalRuimtes: formValues.aantalRuimtes,
      };
      return berekenAirco(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

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
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Oppervlakte ruimte"
                name="oppervlakte"
                type="number"
                register={register("oppervlakte", { valueAsNumber: true })}
                error={errors.oppervlakte}
                min={0}
                step={1}
                unit="m²"
                required
              />

              <InputFieldRHF
                label="Plafondhoogte"
                name="hoogte"
                type="number"
                register={register("hoogte", { valueAsNumber: true })}
                error={errors.hoogte}
                min={2}
                max={5}
                step={0.1}
                unit="m"
                required
              />

              <SelectFieldRHF
                label="Isolatieniveau"
                name="isolatieNiveau"
                register={register("isolatieNiveau")}
                error={errors.isolatieNiveau}
                options={[
                  { value: "goed", label: "Goed geïsoleerd" },
                  { value: "gemiddeld", label: "Gemiddeld" },
                  { value: "slecht", label: "Slecht geïsoleerd / veel ramen" },
                ]}
                required
              />

              <SelectFieldRHF
                label="Toepassing"
                name="toepassing"
                register={register("toepassing")}
                error={errors.toepassing}
                options={[
                  { value: "koelen", label: "Alleen koelen" },
                  { value: "koelen-verwarmen", label: "Koelen + verwarmen" },
                ]}
                required
              />

              <InputFieldRHF
                label="Koeluren per jaar"
                name="koelurenPerJaar"
                type="number"
                register={register("koelurenPerJaar", { valueAsNumber: true })}
                error={errors.koelurenPerJaar}
                min={0}
                step={100}
                unit="uren"
                defaultValue={720}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advies</h3>
                <p className="text-gray-700 mb-4">{result.advies}</p>
                <p className="text-sm text-gray-600">Ruimte inhoud: {result.ruimteInhoud} m³</p>
              </div>

              <LeadForm tool="airco" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
