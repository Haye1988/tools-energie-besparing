import { describe, it, expect } from "vitest";
import { berekenWarmtepomp, type WarmtepompInput } from "@/lib/calculations/warmtepomp";

describe("berekenWarmtepomp", () => {
  const baseInput: WarmtepompInput = {
    gasVerbruik: 1200,
    woningType: "tussenwoning",
    isolatieNiveau: "matig",
    warmtepompType: "hybride",
    gasPrijs: 1.2,
    stroomPrijs: 0.27,
    cop: 4,
  };

  it("should calculate correct power requirement", () => {
    const result = berekenWarmtepomp(baseInput);

    expect(result.benodigdVermogen).toBeGreaterThan(0);
    expect(result.benodigdVermogen).toBeLessThan(10); // Realistic range
    expect(result.stroomVerbruik).toBeGreaterThan(0);
    expect(result.nettoBesparing).toBeGreaterThan(0);
  });

  it("should calculate different power for different house types", () => {
    const appartementInput: WarmtepompInput = {
      ...baseInput,
      woningType: "appartement",
    };

    const vrijstaandInput: WarmtepompInput = {
      ...baseInput,
      woningType: "vrijstaand",
    };

    const appartementResult = berekenWarmtepomp(appartementInput);
    const vrijstaandResult = berekenWarmtepomp(vrijstaandInput);

    expect(vrijstaandResult.benodigdVermogen).toBeGreaterThan(appartementResult.benodigdVermogen);
  });

  it("should calculate different power for different insulation levels", () => {
    const slechtInput: WarmtepompInput = {
      ...baseInput,
      isolatieNiveau: "slecht",
    };

    const goedInput: WarmtepompInput = {
      ...baseInput,
      isolatieNiveau: "goed",
    };

    const slechtResult = berekenWarmtepomp(slechtInput);
    const goedResult = berekenWarmtepomp(goedInput);

    expect(slechtResult.benodigdVermogen).toBeGreaterThan(goedResult.benodigdVermogen);
  });

  it("should calculate different gas usage for hybrid vs all-electric", () => {
    const hybrideInput: WarmtepompInput = {
      ...baseInput,
      warmtepompType: "hybride",
    };

    const allElectricInput: WarmtepompInput = {
      ...baseInput,
      warmtepompType: "all-electric",
    };

    const hybrideResult = berekenWarmtepomp(hybrideInput);
    const allElectricResult = berekenWarmtepomp(allElectricInput);

    // Hybrid should have rest gas usage, all-electric should not
    expect(hybrideResult.restGasVerbruik).toBeGreaterThan(0);
    expect(allElectricResult.restGasVerbruik).toBe(0);

    // Hybrid should have lower electricity usage (less heat provided by heat pump)
    expect(hybrideResult.stroomVerbruik).toBeLessThan(allElectricResult.stroomVerbruik);
  });

  it("should apply extra insulation correction", () => {
    const withCorrection: WarmtepompInput = {
      ...baseInput,
      isolatieCorrectie: 20, // 20% extra correction
    };

    const withoutCorrection = berekenWarmtepomp(baseInput);
    const withCorrectionResult = berekenWarmtepomp(withCorrection);

    expect(withCorrectionResult.benodigdVermogen).toBeLessThan(withoutCorrection.benodigdVermogen);
  });

  it("should calculate payback time when installation costs are provided", () => {
    const withCosts: WarmtepompInput = {
      ...baseInput,
      installatieKosten: 10000,
    };

    const result = berekenWarmtepomp(withCosts);

    expect(result.terugverdientijd).toBeDefined();
    expect(result.terugverdientijd).toBeGreaterThan(0);
  });

  it("should adjust payback time with subsidy", () => {
    const withSubsidy: WarmtepompInput = {
      ...baseInput,
      installatieKosten: 10000,
      subsidieBedrag: 2000,
    };

    const withoutSubsidy: WarmtepompInput = {
      ...baseInput,
      installatieKosten: 10000,
    };

    const withSubsidyResult = berekenWarmtepomp(withSubsidy);
    const withoutSubsidyResult = berekenWarmtepomp(withoutSubsidy);

    if (withSubsidyResult.terugverdientijd && withoutSubsidyResult.terugverdientijd) {
      expect(withSubsidyResult.terugverdientijd).toBeLessThan(withoutSubsidyResult.terugverdientijd);
    }
  });

  it("should calculate scenario ranges", () => {
    const result = berekenWarmtepomp(baseInput);

    expect(result.scenarioRange).toBeDefined();
    expect(result.scenarioRange?.vermogen).toBeDefined();
    expect(result.scenarioRange?.besparing).toBeDefined();

    // Optimistic should be better than pessimistic
    const vermogenOptimistisch = result.scenarioRange?.vermogen.optimistisch;
    const vermogenPessimistisch = result.scenarioRange?.vermogen.pessimistisch;
    const besparingOptimistisch = result.scenarioRange?.besparing.optimistisch;
    const besparingPessimistisch = result.scenarioRange?.besparing.pessimistisch;
    const vermogenNormaal = result.scenarioRange?.vermogen.normaal;

    if (vermogenOptimistisch && vermogenPessimistisch) {
      expect(vermogenOptimistisch).toBeLessThan(vermogenPessimistisch);
    }
    if (besparingOptimistisch && besparingPessimistisch) {
      expect(besparingOptimistisch).toBeGreaterThan(besparingPessimistisch);
    }

    // Normal should be between optimistic and pessimistic
    if (vermogenNormaal && vermogenOptimistisch && vermogenPessimistisch) {
      expect(vermogenNormaal).toBeGreaterThanOrEqual(vermogenOptimistisch);
      expect(vermogenNormaal).toBeLessThanOrEqual(vermogenPessimistisch);
    }
  });

  it("should calculate CO2 reduction", () => {
    const result = berekenWarmtepomp(baseInput);

    expect(result.co2Reductie).toBeGreaterThan(0);
    expect(result.gasBesparing).toBeGreaterThan(0);
    // CO2 reduction should be approximately 1.8 kg per m³ gas
    if (result.gasBesparing) {
      expect(result.co2Reductie).toBeCloseTo(result.gasBesparing * 1.8, 0);
    }
  });
});

