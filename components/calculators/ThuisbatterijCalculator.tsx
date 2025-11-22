"use client";

import { useState, useMemo } from "react";
import { berekenThuisbatterij, ThuisbatterijInput } from "@/lib/calculations/thuisbatterij";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function ThuisbatterijCalculator() {
  const [input, setInput] = useState<ThuisbatterijInput>({
    zonnepaneelVermogen: 5,
    jaarlijksVerbruik: 4000,
    doel: "eigen-verbruik",
    salderingActief: true,
    stroomPrijs: 0.27,
    terugleverVergoeding: 0.08,
  });

  const result = useMemo(() => {
    try {
      return berekenThuisbatterij(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

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
              <InputField
                label="Zonnepaneel vermogen"
                name="zonnepaneelVermogen"
                type="number"
                value={input.zonnepaneelVermogen}
                onChange={(val) => setInput({ ...input, zonnepaneelVermogen: Number(val) })}
                min={0}
                step={0.5}
                unit="kWp"
              />

              <InputField
                label="Jaarlijks stroomverbruik"
                name="jaarlijksVerbruik"
                type="number"
                value={input.jaarlijksVerbruik}
                onChange={(val) => setInput({ ...input, jaarlijksVerbruik: Number(val) })}
                min={0}
                step={100}
                unit="kWh/jaar"
              />

              <SelectField
                label="Doel"
                name="doel"
                value={input.doel}
                onChange={(val) => setInput({ ...input, doel: val as any })}
                options={[
                  { value: "eigen-verbruik", label: "Maximaal eigen verbruik verhogen" },
                  { value: "backup", label: "Backup bij stroomuitval" },
                  { value: "dynamisch", label: "Profiteren van dynamische tarieven" },
                ]}
              />

              {input.doel === "backup" && (
                <InputField
                  label="Gewenste autonomie"
                  name="gewensteAutonomie"
                  type="number"
                  value={input.gewensteAutonomie ?? 4}
                  onChange={(val) => setInput({ ...input, gewensteAutonomie: Number(val) })}
                  min={1}
                  max={24}
                  step={1}
                  unit="uren"
                />
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="salderingActief"
                  checked={input.salderingActief}
                  onChange={(e) => setInput({ ...input, salderingActief: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="salderingActief" className="text-sm text-gray-700">
                  Saldering nog actief (2025)
                </label>
              </div>

              <InputField
                label="Stroomprijs"
                name="stroomPrijs"
                type="number"
                value={input.stroomPrijs ?? 0.27}
                onChange={(val) => setInput({ ...input, stroomPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/kWh"
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
