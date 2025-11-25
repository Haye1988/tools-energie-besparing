"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenEnergiecontract, EnergiecontractInput } from "@/lib/calculations/energiecontract";
import {
  energiecontractSchema,
  EnergiecontractFormData,
} from "@/lib/validations/energiecontract.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function EnergiecontractCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EnergiecontractFormData>({
    resolver: zodResolver(energiecontractSchema),
    defaultValues: {
      huidigStroomPrijs: 0.35,
      huidigGasPrijs: 1.5,
      nieuwStroomPrijs: 0.27,
      nieuwGasPrijs: 1.2,
      jaarverbruikStroom: 2500,
      jaarverbruikGas: 1000,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: EnergiecontractInput = {
        huidigStroomPrijs: formValues.huidigStroomPrijs,
        huidigGasPrijs: formValues.huidigGasPrijs,
        nieuwStroomPrijs: formValues.nieuwStroomPrijs,
        nieuwGasPrijs: formValues.nieuwGasPrijs,
        jaarverbruikStroom: formValues.jaarverbruikStroom,
        jaarverbruikGas: formValues.jaarverbruikGas,
        contractType: formValues.contractType,
        vastrechtHuidig: formValues.vastrechtHuidig,
        vastrechtNieuw: formValues.vastrechtNieuw,
        netbeheerderKosten: formValues.netbeheerderKosten,
        groeneStroom: formValues.groeneStroom,
        prijsVerwachting: formValues.prijsVerwachting,
      };
      return berekenEnergiecontract(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

  return (
    <CalculatorLayout
      tool="energiecontract"
      title="Energiecontract Calculator"
      description="Vergelijk je huidige contract met een nieuw aanbod"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Huidig contract</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Stroomprijs"
                name="huidigStroomPrijs"
                type="number"
                register={register("huidigStroomPrijs", { valueAsNumber: true })}
                error={errors.huidigStroomPrijs}
                min={0}
                step={0.01}
                unit="€/kWh"
                required
              />

              <InputFieldRHF
                label="Gasprijs"
                name="huidigGasPrijs"
                type="number"
                register={register("huidigGasPrijs", { valueAsNumber: true })}
                error={errors.huidigGasPrijs}
                min={0}
                step={0.01}
                unit="€/m³"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Nieuw contract</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Stroomprijs"
                name="nieuwStroomPrijs"
                type="number"
                register={register("nieuwStroomPrijs", { valueAsNumber: true })}
                error={errors.nieuwStroomPrijs}
                min={0}
                step={0.01}
                unit="€/kWh"
                required
              />

              <InputFieldRHF
                label="Gasprijs"
                name="nieuwGasPrijs"
                type="number"
                register={register("nieuwGasPrijs", { valueAsNumber: true })}
                error={errors.nieuwGasPrijs}
                min={0}
                step={0.01}
                unit="€/m³"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Verbruik</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Jaarverbruik stroom"
                name="jaarverbruikStroom"
                type="number"
                register={register("jaarverbruikStroom", { valueAsNumber: true })}
                error={errors.jaarverbruikStroom}
                min={0}
                step={100}
                unit="kWh/jaar"
                required
              />

              <InputFieldRHF
                label="Jaarverbruik gas"
                name="jaarverbruikGas"
                type="number"
                register={register("jaarverbruikGas", { valueAsNumber: true })}
                error={errors.jaarverbruikGas}
                min={0}
                step={100}
                unit="m³/jaar"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Huidige kosten"
                  value={result.huidigeKosten}
                  unit="€/jaar"
                  variant="warning"
                />

                <ResultCard
                  title="Nieuwe kosten"
                  value={result.nieuweKosten}
                  unit="€/jaar"
                  variant="info"
                />

                <ResultCard
                  title="Verschil"
                  value={result.verschil}
                  unit="€/jaar"
                  variant={result.verschil < 0 ? "success" : "warning"}
                />

                <ResultCard
                  title="Maandelijks verschil"
                  value={result.maandelijksVerschil}
                  unit="€/maand"
                  variant={result.verschil < 0 ? "success" : "warning"}
                />
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vergelijking</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-medium">Stroom:</p>
                    <p>Huidig: €{result.stroomKostenHuidig.toFixed(2)}/jaar</p>
                    <p>Nieuw: €{result.stroomKostenNieuw.toFixed(2)}/jaar</p>
                    <p className="text-sm text-gray-600">
                      Verschil: €{(result.stroomKostenNieuw - result.stroomKostenHuidig).toFixed(2)}
                      /jaar
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Gas:</p>
                    <p>Huidig: €{result.gasKostenHuidig.toFixed(2)}/jaar</p>
                    <p>Nieuw: €{result.gasKostenNieuw.toFixed(2)}/jaar</p>
                    <p className="text-sm text-gray-600">
                      Verschil: €{(result.gasKostenNieuw - result.gasKostenHuidig).toFixed(2)}/jaar
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="font-semibold">
                      {result.verschil < 0
                        ? `Je bespaart €${Math.abs(result.verschil).toFixed(2)} per jaar (${Math.abs(result.verschilPercentage).toFixed(1)}%)`
                        : `Het nieuwe contract is €${result.verschil.toFixed(2)} duurder per jaar`}
                    </p>
                  </div>
                </div>
              </div>

              <LeadForm tool="energiecontract" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
