"use client";

import { useState, useMemo } from "react";
import { berekenEnergiecontract, EnergiecontractInput } from "@/lib/calculations/energiecontract";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputField from "@/components/shared/InputField";
import ResultCard from "@/components/shared/ResultCard";
import LeadForm from "@/components/shared/LeadForm";

export default function EnergiecontractCalculator() {
  const [input, setInput] = useState<EnergiecontractInput>({
    huidigStroomPrijs: 0.35,
    huidigGasPrijs: 1.50,
    nieuwStroomPrijs: 0.27,
    nieuwGasPrijs: 1.20,
    jaarverbruikStroom: 2500,
    jaarverbruikGas: 1000,
  });

  const result = useMemo(() => {
    try {
      return berekenEnergiecontract(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [input]);

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
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">
              Huidig contract
            </h2>
            
            <div className="space-y-5">
              <InputField
                label="Stroomprijs"
                name="huidigStroomPrijs"
                type="number"
                value={input.huidigStroomPrijs}
                onChange={(val) => setInput({ ...input, huidigStroomPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/kWh"
              />
              
              <InputField
                label="Gasprijs"
                name="huidigGasPrijs"
                type="number"
                value={input.huidigGasPrijs}
                onChange={(val) => setInput({ ...input, huidigGasPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/m³"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">
              Nieuw contract
            </h2>
            
            <div className="space-y-5">
              <InputField
                label="Stroomprijs"
                name="nieuwStroomPrijs"
                type="number"
                value={input.nieuwStroomPrijs}
                onChange={(val) => setInput({ ...input, nieuwStroomPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/kWh"
              />
              
              <InputField
                label="Gasprijs"
                name="nieuwGasPrijs"
                type="number"
                value={input.nieuwGasPrijs}
                onChange={(val) => setInput({ ...input, nieuwGasPrijs: Number(val) })}
                min={0}
                step={0.01}
                unit="€/m³"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">
              Verbruik
            </h2>
            
            <div className="space-y-5">
              <InputField
                label="Jaarverbruik stroom"
                name="jaarverbruikStroom"
                type="number"
                value={input.jaarverbruikStroom}
                onChange={(val) => setInput({ ...input, jaarverbruikStroom: Number(val) })}
                min={0}
                step={100}
                unit="kWh/jaar"
              />
              
              <InputField
                label="Jaarverbruik gas"
                name="jaarverbruikGas"
                type="number"
                value={input.jaarverbruikGas}
                onChange={(val) => setInput({ ...input, jaarverbruikGas: Number(val) })}
                min={0}
                step={100}
                unit="m³/jaar"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vergelijking
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-medium">Stroom:</p>
                    <p>Huidig: €{result.stroomKostenHuidig.toFixed(2)}/jaar</p>
                    <p>Nieuw: €{result.stroomKostenNieuw.toFixed(2)}/jaar</p>
                    <p className="text-sm text-gray-600">
                      Verschil: €{(result.stroomKostenNieuw - result.stroomKostenHuidig).toFixed(2)}/jaar
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
                        : `Het nieuwe contract is €${result.verschil.toFixed(2)} duurder per jaar`
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <LeadForm
                tool="energiecontract"
                results={result}
              />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}

