"use client";

import { useState, useMemo } from "react";
import { berekenEnergielabel, EnergielabelInput } from "@/lib/calculations/energielabel";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function EnergielabelCalculator() {
  const [input, setInput] = useState<EnergielabelInput>({
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
  });

  const result = useMemo(() => {
    try {
      return berekenEnergielabel(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

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
              <InputField
                label="Bouwjaar"
                name="bouwjaar"
                type="number"
                value={input.bouwjaar}
                onChange={(val) => setInput({ ...input, bouwjaar: Number(val) })}
                min={1900}
                max={2025}
                step={1}
              />

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
                label="Oppervlakte"
                name="oppervlakte"
                type="number"
                value={input.oppervlakte}
                onChange={(val) => setInput({ ...input, oppervlakte: Number(val) })}
                min={0}
                step={10}
                unit="m²"
              />

              <SelectField
                label="Isolatie dak"
                name="isolatieDak"
                value={input.isolatieDak}
                onChange={(val) => setInput({ ...input, isolatieDak: val as any })}
                options={[
                  { value: "geen", label: "Geen isolatie" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
              />

              <SelectField
                label="Isolatie muren"
                name="isolatieMuren"
                value={input.isolatieMuren}
                onChange={(val) => setInput({ ...input, isolatieMuren: val as any })}
                options={[
                  { value: "geen", label: "Geen isolatie" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
              />

              <SelectField
                label="Isolatie vloer"
                name="isolatieVloer"
                value={input.isolatieVloer}
                onChange={(val) => setInput({ ...input, isolatieVloer: val as any })}
                options={[
                  { value: "geen", label: "Geen isolatie" },
                  { value: "matig", label: "Matig" },
                  { value: "goed", label: "Goed" },
                ]}
              />

              <SelectField
                label="Glastype"
                name="glasType"
                value={input.glasType}
                onChange={(val) => setInput({ ...input, glasType: val as any })}
                options={[
                  { value: "enkel", label: "Enkel glas" },
                  { value: "dubbel", label: "Dubbel glas" },
                  { value: "hr", label: "HR glas" },
                ]}
              />

              <SelectField
                label="Verwarmingssysteem"
                name="verwarmingssysteem"
                value={input.verwarmingssysteem}
                onChange={(val) => setInput({ ...input, verwarmingssysteem: val as any })}
                options={[
                  { value: "cv-ketel", label: "CV-ketel" },
                  { value: "warmtepomp", label: "Warmtepomp" },
                  { value: "hybride", label: "Hybride" },
                ]}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="zonnepanelen"
                  checked={input.zonnepanelen}
                  onChange={(e) => setInput({ ...input, zonnepanelen: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="zonnepanelen" className="text-sm text-gray-700">
                  Ik heb zonnepanelen
                </label>
              </div>

              {input.zonnepanelen && (
                <InputField
                  label="Zonnepaneel vermogen"
                  name="zonnepaneelVermogen"
                  type="number"
                  value={input.zonnepaneelVermogen ?? 0}
                  onChange={(val) => setInput({ ...input, zonnepaneelVermogen: Number(val) })}
                  min={0}
                  step={0.5}
                  unit="kWp"
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
