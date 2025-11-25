"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenEnergielabel, EnergielabelInput } from "@/lib/calculations/energielabel";
import { energielabelSchema, EnergielabelFormData } from "@/lib/validations/energielabel.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function EnergielabelCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EnergielabelFormData>({
    resolver: zodResolver(energielabelSchema),
    defaultValues: {
      bouwjaar: 1980,
      woningType: "tussenwoning",
      oppervlakte: 120,
      isolatieDak: "matig",
      isolatieMuren: "matig",
      isolatieVloer: "matig",
      glasType: "dubbel",
      verwarmingssysteem: "cv-ketel",
      zonnepanelen: false,
      zonnepaneelVermogen: 0,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const result = useMemo(() => {
    try {
      const input: EnergielabelInput = {
        bouwjaar: formValues.bouwjaar,
        woningType: formValues.woningType,
        oppervlakte: formValues.oppervlakte,
        isolatieDak: formValues.isolatieDak,
        isolatieMuren: formValues.isolatieMuren,
        isolatieVloer: formValues.isolatieVloer,
        glasType: formValues.glasType,
        verwarmingssysteem: formValues.verwarmingssysteem,
        zonnepanelen: formValues.zonnepanelen,
        zonnepaneelVermogen: formValues.zonnepaneelVermogen,
        rcWaardeDak: formValues.rcWaardeDak,
        rcWaardeMuren: formValues.rcWaardeMuren,
        rcWaardeVloer: formValues.rcWaardeVloer,
        verwarmingType: formValues.verwarmingType,
        ventilatieType: formValues.ventilatieType,
      };
      return berekenEnergielabel(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [formValues]);

  return (
    <CalculatorLayout
      tool="energielabel"
      title="Energielabel Calculator"
      description="Bereken je indicatieve energielabel en verbeteradvies"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
              <InputFieldRHF
                label="Bouwjaar"
                name="bouwjaar"
                type="number"
                register={register("bouwjaar", { valueAsNumber: true })}
                error={errors.bouwjaar}
                min={1900}
                max={2025}
                step={1}
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
                label="Oppervlakte"
                name="oppervlakte"
                type="number"
                register={register("oppervlakte", { valueAsNumber: true })}
                error={errors.oppervlakte}
                min={0}
                step={10}
                unit="m²"
                required
              />

              <SelectFieldRHF
                label="Isolatie dak"
                name="isolatieDak"
                register={register("isolatieDak")}
                error={errors.isolatieDak}
                options={[
                  { value: "geen", label: "Geen isolatie" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
                required
              />

              <SelectFieldRHF
                label="Isolatie muren"
                name="isolatieMuren"
                register={register("isolatieMuren")}
                error={errors.isolatieMuren}
                options={[
                  { value: "geen", label: "Geen isolatie" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
                required
              />

              <SelectFieldRHF
                label="Isolatie vloer"
                name="isolatieVloer"
                register={register("isolatieVloer")}
                error={errors.isolatieVloer}
                options={[
                  { value: "geen", label: "Geen isolatie" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
                required
              />

              <SelectFieldRHF
                label="Glastype"
                name="glasType"
                register={register("glasType")}
                error={errors.glasType}
                options={[
                  { value: "enkel", label: "Enkel glas" },
                  { value: "dubbel", label: "Dubbel glas" },
                  { value: "hr", label: "HR glas" },
                ]}
                required
              />

              <SelectFieldRHF
                label="Verwarmingssysteem"
                name="verwarmingssysteem"
                register={register("verwarmingssysteem")}
                error={errors.verwarmingssysteem}
                options={[
                  { value: "cv-ketel", label: "CV-ketel" },
                  { value: "warmtepomp", label: "Warmtepomp" },
                  { value: "hybride", label: "Hybride" },
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

              {formValues.zonnepanelen && (
                <InputFieldRHF
                  label="Zonnepaneel vermogen"
                  name="zonnepaneelVermogen"
                  type="number"
                  register={register("zonnepaneelVermogen", { valueAsNumber: true })}
                  error={errors.zonnepaneelVermogen}
                  min={0}
                  step={0.5}
                  unit="kWp"
                  defaultValue={0}
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard title="Huidig label" value={result.huidigLabel} variant="info" />

                <ResultCard title="EPG waarde" value={result.epgWaarde} variant="info" />

                <ResultCard
                  title="Potentiële besparing"
                  value={result.potentieleBesparing}
                  unit="€/jaar"
                  variant="success"
                />
              </div>

              <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verbeteradvies</h3>
                <ul className="space-y-2">
                  {result.verbeterAdvies.map((advies, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{advies}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <LeadForm tool="energielabel" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
