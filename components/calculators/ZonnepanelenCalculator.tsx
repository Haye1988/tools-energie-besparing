"use client";

import { useState, useMemo } from "react";
import { berekenZonnepanelen, ZonnepanelenInput } from "@/lib/calculations/zonnepanelen";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";
import { Sun, Zap, TrendingUp, Euro } from "lucide-react";

export default function ZonnepanelenCalculator() {
  const [input, setInput] = useState<ZonnepanelenInput>({
    jaarlijksVerbruik: 3500,
    dakOrientatie: "zuid",
    dakHellingshoek: 35,
    paneelVermogen: 400,
    stroomPrijs: 0.30,
  });

  const result = useMemo(() => {
    try {
      return berekenZonnepanelen(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

  return (
    <CalculatorLayout
      tool="zonnepanelen"
      title="Zonnepanelen Calculator"
      description="Bereken hoeveel zonnepanelen je nodig hebt en wat je bespaart"
      context={result || {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-gray-100 p-6 lg:p-8 lg:p-8 shadow-card animate-slide-up">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">
              Jouw gegevens
            </h2>
            
            <div className="space-y-5">
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
                label="Dakoriëntatie"
                name="dakOrientatie"
                value={input.dakOrientatie}
                onChange={(val) => setInput({ ...input, dakOrientatie: val as any })}
                options={[
                  { value: "zuid", label: "Zuid (optimaal)" },
                  { value: "zuidoost", label: "Zuidoost" },
                  { value: "zuidwest", label: "Zuidwest" },
                  { value: "oost", label: "Oost" },
                  { value: "west", label: "West" },
                  { value: "noord", label: "Noord" },
                ]}
              />
              
              <InputField
                label="Dakhellingshoek"
                name="dakHellingshoek"
                type="number"
                value={input.dakHellingshoek}
                onChange={(val) => setInput({ ...input, dakHellingshoek: Number(val) })}
                min={0}
                max={90}
                step={5}
                unit="°"
              />
              
              <InputField
                label="Vermogen per paneel"
                name="paneelVermogen"
                type="number"
                value={input.paneelVermogen}
                onChange={(val) => setInput({ ...input, paneelVermogen: Number(val) })}
                min={200}
                max={600}
                step={50}
                unit="Wp"
              />
              
              <InputField
                label="Stroomprijs"
                name="stroomPrijs"
                type="number"
                value={input.stroomPrijs}
                onChange={(val) => setInput({ ...input, stroomPrijs: Number(val) })}
                min={0}
                max={1}
                step={0.01}
                unit="€/kWh"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <ResultCard
                  title="Aantal panelen"
                  value={result.aantalPanelen}
                  unit="stuks"
                  icon={<Sun className="w-8 h-8" />}
                  variant="info"
                />
                
                <ResultCard
                  title="Vermogen"
                  value={result.benodigdVermogen}
                  unit="kWp"
                  icon={<Zap className="w-8 h-8" />}
                  variant="info"
                />
                
                <ResultCard
                  title="Jaarlijkse opwekking"
                  value={result.jaarlijkseOpwekking}
                  unit="kWh"
                  icon={<TrendingUp className="w-8 h-8" />}
                  variant="success"
                />
                
                <ResultCard
                  title="Jaarlijkse besparing"
                  value={result.jaarlijkseBesparing}
                  unit="€"
                  icon={<Euro className="w-8 h-8" />}
                  variant="success"
                />
              </div>
              
              <div className="bg-white rounded-card border border-gray-100 p-6 lg:p-8 lg:p-8 shadow-card animate-slide-up">
                <h3 className="text-xl font-bold text-totaaladvies-blue mb-4">
                  Resultaat
                </h3>
                <div className="space-y-3 text-totaaladvies-gray-medium">
                  <p>
                    Met <strong className="text-totaaladvies-blue">{result.aantalPanelen} zonnepanelen</strong> van {input.paneelVermogen} Wp wek je ongeveer{" "}
                    <strong className="text-totaaladvies-blue">{result.jaarlijkseOpwekking.toLocaleString("nl-NL")} kWh</strong> per jaar op.
                    Dit dekt <strong className="text-totaaladvies-blue">{result.dekkingPercentage.toFixed(1)}%</strong> van je verbruik.
                  </p>
                  <p>
                    Je bespaart ongeveer <strong className="text-totaaladvies-orange text-lg">€{result.jaarlijkseBesparing.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> per jaar aan stroomkosten.
                  </p>
                </div>
              </div>
              
              <LeadForm
                tool="zonnepanelen"
                results={result}
              />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}

