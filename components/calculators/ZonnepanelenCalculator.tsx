"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { berekenZonnepanelen, ZonnepanelenInput } from "@/lib/calculations/zonnepanelen";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useCalculationTracking } from "@/lib/hooks/useCalculationTracking";
import { zonnepanelenSchema, ZonnepanelenFormData } from "@/lib/validations/zonnepanelen.schema";
import CalculatorLayout from "@/components/shared/CalculatorLayout";
import InputFieldRHF from "@/components/shared/InputFieldRHF";
import SelectFieldRHF from "@/components/shared/SelectFieldRHF";
import RangeSlider from "@/components/shared/RangeSlider";
import ResultCard from "@/components/shared/ResultCard";
import GraphChart from "@/components/shared/GraphChart";
import LeadForm from "@/components/shared/LeadForm";
import { Sun, Zap, TrendingUp, Euro } from "lucide-react";

export default function ZonnepanelenCalculator() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ZonnepanelenFormData>({
    resolver: zodResolver(zonnepanelenSchema),
    defaultValues: {
      jaarlijksVerbruik: 3500,
      dakOrientatie: "zuid",
      dakHellingshoek: 35,
      paneelVermogen: 400,
      stroomPrijs: 0.3,
      schaduwPercentage: 0,
      salderingActief: true,
      terugleverVergoeding: 0.08,
      thuisbatterij: false,
    },
    mode: "onChange",
  });

  const formValues = watch();
  // Debounce input voor betere performance bij snelle wijzigingen
  const debouncedInput = useDebounce(formValues, 300);

  const result = useMemo(() => {
    try {
      // Convert form data to calculation input
      const input: ZonnepanelenInput = {
        jaarlijksVerbruik: debouncedInput.jaarlijksVerbruik,
        dakOrientatie: debouncedInput.dakOrientatie,
        dakHellingshoek: debouncedInput.dakHellingshoek,
        dakoppervlak: debouncedInput.dakoppervlak,
        paneelVermogen: debouncedInput.paneelVermogen,
        stroomPrijs: debouncedInput.stroomPrijs,
        schaduwPercentage: debouncedInput.schaduwPercentage,
        investeringsKosten: debouncedInput.investeringsKosten,
        salderingActief: debouncedInput.salderingActief,
        terugleverVergoeding: debouncedInput.terugleverVergoeding,
        thuisbatterij: debouncedInput.thuisbatterij,
      };
      return berekenZonnepanelen(input);
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [debouncedInput]);

  // Track calculation completion
  useCalculationTracking("zonnepanelen", result);

  // Maandelijkse data voor grafiek (vereenvoudigd - gelijkmatige verdeling)
  const maandelijkseData = useMemo(() => {
    if (!result || !result.jaarlijkseOpwekking) return [];
    const maanden = [
      "Jan",
      "Feb",
      "Mrt",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ];
    const maandelijksVerbruik = formValues.jaarlijksVerbruik / 12;
    const maandelijksOpwekking = result.jaarlijkseOpwekking / 12;

    // Seizoenscorrectie: zomer meer opwekking, winter minder
    const seizoensfactoren = [0.3, 0.4, 0.6, 0.9, 1.2, 1.3, 1.3, 1.2, 0.9, 0.6, 0.4, 0.3];

    return maanden.map((maand, index) => ({
      maand,
      verbruik: Math.round(maandelijksVerbruik),
      opwekking: Math.round(maandelijksOpwekking * seizoensfactoren[index]!),
    }));
  }, [result, formValues.jaarlijksVerbruik]);

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
            <h2 className="text-2xl font-bold text-totaaladvies-blue mb-6">Jouw gegevens</h2>

            <div className="space-y-5">
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
                label="Dakoriëntatie"
                name="dakOrientatie"
                register={register("dakOrientatie")}
                error={errors.dakOrientatie}
                options={[
                  { value: "zuid", label: "Zuid (optimaal)" },
                  { value: "zuidoost", label: "Zuidoost" },
                  { value: "zuidwest", label: "Zuidwest" },
                  { value: "oost", label: "Oost" },
                  { value: "west", label: "West" },
                  { value: "noord", label: "Noord" },
                ]}
                required
              />

              <InputFieldRHF
                label="Dakhellingshoek"
                name="dakHellingshoek"
                type="number"
                register={register("dakHellingshoek", { valueAsNumber: true })}
                error={errors.dakHellingshoek}
                min={0}
                max={90}
                step={5}
                unit="°"
                required
              />

              <InputFieldRHF
                label="Vermogen per paneel"
                name="paneelVermogen"
                type="number"
                register={register("paneelVermogen", { valueAsNumber: true })}
                error={errors.paneelVermogen}
                min={200}
                max={600}
                step={50}
                unit="Wp"
                required
              />

              <InputFieldRHF
                label="Stroomprijs"
                name="stroomPrijs"
                type="number"
                register={register("stroomPrijs", { valueAsNumber: true })}
                error={errors.stroomPrijs}
                min={0}
                max={1}
                step={0.01}
                unit="€/kWh"
                required
              />

              <RangeSlider
                label="Schaduwpercentage"
                name="schaduwPercentage"
                value={formValues.schaduwPercentage || 0}
                onChange={(val) => setValue("schaduwPercentage", val)}
                min={0}
                max={50}
                step={5}
                unit="%"
                helpText="Hoeveel procent van de dag ligt het dak in de schaduw?"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="salderingActief"
                  {...register("salderingActief")}
                  className="w-4 h-4 text-totaaladvies-orange border-gray-300 rounded focus:ring-totaaladvies-orange"
                />
                <label
                  htmlFor="salderingActief"
                  className="text-sm font-medium text-totaaladvies-gray-medium"
                >
                  Saldering actief (100% saldering)
                </label>
              </div>

              {!formValues.salderingActief && (
                <InputFieldRHF
                  label="Terugleververgoeding"
                  name="terugleverVergoeding"
                  type="number"
                  register={register("terugleverVergoeding", { valueAsNumber: true })}
                  error={errors.terugleverVergoeding}
                  min={0}
                  max={0.5}
                  step={0.01}
                  unit="€/kWh"
                  helpText="Vergoeding voor teruggeleverde stroom (standaard €0.08/kWh)"
                  defaultValue={0.08}
                />
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="thuisbatterij"
                  {...register("thuisbatterij")}
                  className="w-4 h-4 text-totaaladvies-orange border-gray-300 rounded focus:ring-totaaladvies-orange"
                />
                <label
                  htmlFor="thuisbatterij"
                  className="text-sm font-medium text-totaaladvies-gray-medium"
                >
                  Thuisbatterij
                </label>
              </div>

              {formValues.thuisbatterij && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    De batterijcapaciteit wordt automatisch berekend op basis van uw zonnepaneel
                    vermogen (1.0-1.5 × kWp).
                  </p>
                </div>
              )}

              <InputFieldRHF
                label="Investeringskosten (optioneel)"
                name="investeringsKosten"
                type="number"
                register={register("investeringsKosten", { valueAsNumber: true })}
                error={errors.investeringsKosten}
                min={0}
                step={1000}
                unit="€"
                helpText="Voor berekening terugverdientijd (standaard ~€1000 per kWp)"
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
                <h3 className="text-xl font-bold text-totaaladvies-blue mb-4">Resultaat</h3>
                <div className="space-y-3 text-totaaladvies-gray-medium">
                  <p>
                    Met{" "}
                    <strong className="text-totaaladvies-blue">
                      {result.aantalPanelen} zonnepanelen
                    </strong>{" "}
                    van {formValues.paneelVermogen} Wp wek je ongeveer{" "}
                    <strong className="text-totaaladvies-blue">
                      {result.jaarlijkseOpwekking.toLocaleString("nl-NL")} kWh
                    </strong>{" "}
                    per jaar op. Dit dekt{" "}
                    <strong className="text-totaaladvies-blue">
                      {result.dekkingPercentage.toFixed(1)}%
                    </strong>{" "}
                    van je verbruik.
                  </p>
                  <p>
                    Je bespaart ongeveer{" "}
                    <strong className="text-totaaladvies-orange text-lg">
                      €
                      {result.jaarlijkseBesparing.toLocaleString("nl-NL", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>{" "}
                    per jaar aan stroomkosten.
                  </p>
                  {result.terugverdientijd && (
                    <p>
                      <strong>Terugverdientijd:</strong> {result.terugverdientijd} jaar
                    </p>
                  )}
                  {result.besparingMetSaldering && result.besparingZonderSaldering && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-900">
                        <strong>Met saldering:</strong> €
                        {result.besparingMetSaldering.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        /jaar
                      </p>
                      <p className="text-sm text-blue-900">
                        <strong>Zonder saldering:</strong> €
                        {result.besparingZonderSaldering.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        /jaar
                      </p>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Zelfconsumptie zonder batterij:</strong>{" "}
                      {result.zelfconsumptieZonderBatterij}% van opwekking
                    </p>
                    {result.zelfconsumptieMetBatterij && (
                      <p className="text-sm text-gray-700">
                        <strong>Zelfconsumptie met batterij:</strong>{" "}
                        {result.zelfconsumptieMetBatterij}% van opwekking
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {maandelijkseData.length > 0 && (
                <div className="bg-white rounded-card border border-gray-100 p-6 lg:p-8 shadow-card">
                  <h3 className="text-xl font-bold text-totaaladvies-blue mb-4">
                    Verbruik vs Opwekking per Maand
                  </h3>
                  <GraphChart
                    type="bar"
                    data={maandelijkseData}
                    dataKey="maand"
                    bars={[
                      { key: "verbruik", name: "Verbruik (kWh)", color: "#ef4444" },
                      { key: "opwekking", name: "Opwekking (kWh)", color: "#10b981" },
                    ]}
                    xAxisLabel="Maand"
                    yAxisLabel="kWh"
                  />
                </div>
              )}

              <LeadForm tool="zonnepanelen" results={result} />
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
