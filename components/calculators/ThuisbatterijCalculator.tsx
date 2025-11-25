"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenThuisbatterij, ThuisbatterijInput } from "@/lib/calculations/thuisbatterij";
import { thuisbatterijSchema, ThuisbatterijFormData } from "@/lib/validations/thuisbatterij.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function ThuisbatterijCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ThuisbatterijFormData>({
    resolver: zodResolver(thuisbatterijSchema),
    defaultValues: {
      zonnepaneelVermogen: 5,
      jaarlijksVerbruik: 4000,
      doel: "eigen-verbruik",
      salderingActief: true,
      stroomPrijs: 0.27,
      terugleverVergoeding: 0.08,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: ThuisbatterijInput = {
        zonnepaneelVermogen: formValues.zonnepaneelVermogen,
        jaarlijksVerbruik: formValues.jaarlijksVerbruik,
        jaarlijkseOpwekking: formValues.jaarlijkseOpwekking,
        doel: formValues.doel,
        gewensteAutonomie: formValues.gewensteAutonomie,
        salderingActief: formValues.salderingActief,
        stroomPrijs: formValues.stroomPrijs,
        terugleverVergoeding: formValues.terugleverVergoeding,
        investeringsKosten: formValues.investeringsKosten,
      };
      return berekenThuisbatterij(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

  return (
    <CalculatorLayout
      tool="thuisbatterij"
      title="Thuisbatterij Calculator"
      description="Bereken de ideale batterijcapaciteit voor jouw situatie"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Zonnepaneel vermogen"
                name="zonnepaneelVermogen"
                type="number"
                register={register("zonnepaneelVermogen", { valueAsNumber: true })}
                error={errors.zonnepaneelVermogen}
                min={0}
                step={0.5}
                unit="kWp"
                required
              />

              <InputFieldRHF
                label="Jaarlijks stroomverbruik"
                name="jaarlijksVerbruik"
                type="number"
                register={register("jaarlijksVerbruik", { valueAsNumber: true })}
                error={errors.jaarlijksVerbruik}
                min={0}
                step={100}
                unit="kWh/jaar"
                required
              />

              <SelectFieldRHF
                label="Doel"
                name="doel"
                register={register("doel")}
                error={errors.doel}
                options={[
                  { value: "eigen-verbruik", label: "Maximaal eigen verbruik verhogen" },
                  { value: "backup", label: "Backup bij stroomuitval" },
                  { value: "dynamisch", label: "Profiteren van dynamische tarieven" },
                ]}
                required
              />

              {formValues.doel === "backup" && (
                <InputFieldRHF
                  label="Gewenste autonomie"
                  name="gewensteAutonomie"
                  type="number"
                  register={register("gewensteAutonomie", { valueAsNumber: true })}
                  error={errors.gewensteAutonomie}
                  min={1}
                  max={24}
                  step={1}
                  unit="uren"
                  defaultValue={4}
                />
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="salderingActief"
                  {...register("salderingActief")}
                  className="w-4 h-4"
                />
                <label htmlFor="salderingActief" className="text-sm text-gray-700">
                  Saldering nog actief (2025)
                </label>
              </div>

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
                  title="Aanbevolen capaciteit"
                  value={result.aanbevolenCapaciteit}
                  unit="kWh"
                  variant="info"
                />

                <ResultCard
                  title="Range"
                  value={`${result.minimaleCapaciteit} - ${result.maximaleCapaciteit}`}
                  unit="kWh"
                  variant="info"
                />

                <ResultCard
                  title="Eigen verbruik zonder"
                  value={result.eigenVerbruikZonder}
                  unit="%"
                  variant="warning"
                />

                <ResultCard
                  title="Eigen verbruik met"
                  value={result.eigenVerbruikMet}
                  unit="%"
                  variant="success"
                />

                <ResultCard
                  title="Jaarlijkse besparing"
                  value={result.jaarlijkseBesparing}
                  unit="€"
                  variant="success"
                />
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advies</h3>
                <p className="text-gray-700">{result.advies}</p>
              </div>

              <LeadForm tool="thuisbatterij" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
