"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenLaadpaal, LaadpaalInput } from "@/lib/calculations/laadpaal";
import { laadpaalSchema, LaadpaalFormData } from "@/lib/validations/laadpaal.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function LaadpaalCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<LaadpaalFormData>({
    resolver: zodResolver(laadpaalSchema),
    defaultValues: {
      accuCapaciteit: 60,
      gewensteLaadtijd: 8,
      huisaansluiting: "1-fase",
      zonnepanelen: false,
      dynamischContract: false,
      dagTarief: 0.35,
      nachtTarief: 0.2,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: LaadpaalInput = {
        accuCapaciteit: formValues.accuCapaciteit,
        gewensteLaadtijd: formValues.gewensteLaadtijd,
        huisaansluiting: formValues.huisaansluiting,
        zonnepanelen: formValues.zonnepanelen,
        evModel: formValues.evModel,
        netaansluiting: formValues.netaansluiting,
        dynamischContract: formValues.dynamischContract,
        dagTarief: formValues.dagTarief,
        nachtTarief: formValues.nachtTarief,
      };
      return berekenLaadpaal(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

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
              <InputFieldRHF
                label="Accucapaciteit auto"
                name="accuCapaciteit"
                type="number"
                register={register("accuCapaciteit", { valueAsNumber: true })}
                error={errors.accuCapaciteit}
                min={0}
                step={5}
                unit="kWh"
                required
              />

              <InputFieldRHF
                label="Gewenste laadtijd"
                name="gewensteLaadtijd"
                type="number"
                register={register("gewensteLaadtijd", { valueAsNumber: true })}
                error={errors.gewensteLaadtijd}
                min={1}
                max={24}
                step={1}
                unit="uren"
                required
              />

              <SelectFieldRHF
                label="Huisaansluiting"
                name="huisaansluiting"
                register={register("huisaansluiting")}
                error={errors.huisaansluiting}
                options={[
                  { value: "1-fase", label: "1-fase (230V)" },
                  { value: "3-fase", label: "3-fase (400V)" },
                ]}
                required
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="zonnepanelen"
                  {...register("zonnepanelen")}
                  className="w-4 h-4"
                />
                <label htmlFor="zonnepanelen" className="text-sm text-gray-700">
                  Ik heb zonnepanelen
                </label>
              </div>

              <InputFieldRHF
                label="Dagtarief"
                name="dagTarief"
                type="number"
                register={register("dagTarief", { valueAsNumber: true })}
                error={errors.dagTarief}
                min={0}
                step={0.01}
                unit="€/kWh"
                helpText="Stroomprijs overdag (standaard €0.35/kWh)"
                defaultValue={0.35}
              />

              <InputFieldRHF
                label="Nachttarief"
                name="nachtTarief"
                type="number"
                register={register("nachtTarief", { valueAsNumber: true })}
                error={errors.nachtTarief}
                min={0}
                step={0.01}
                unit="€/kWh"
                helpText="Stroomprijs 's nachts (standaard €0.20/kWh)"
                defaultValue={0.2}
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dynamischContract"
                  {...register("dynamischContract")}
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
