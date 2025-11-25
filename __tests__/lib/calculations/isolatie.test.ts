import { describe, it, expect } from "vitest";
import { berekenIsolatie, type IsolatieInput } from "@/lib/calculations/isolatie";

describe("berekenIsolatie", () => {
  const baseInput: IsolatieInput = {
    woningType: "tussenwoning",
    gasVerbruik: 1200,
    maatregelen: ["dak"],
    gasPrijs: 1.2,
  };

  it("should calculate savings for single measure", () => {
    const result = berekenIsolatie(baseInput);

    expect(result.maatregelen).toHaveLength(1);
    expect(result.maatregelen[0]?.gasBesparing).toBeGreaterThan(0);
    expect(result.maatregelen[0]?.kostenBesparing).toBeGreaterThan(0);
    expect(result.maatregelen[0]?.co2Reductie).toBeGreaterThan(0);
    expect(result.totaalGasBesparing).toBeGreaterThan(0);
    expect(result.totaalKostenBesparing).toBeGreaterThan(0);
  });

  it("should calculate savings for multiple measures", () => {
    const multipleInput: IsolatieInput = {
      ...baseInput,
      maatregelen: ["dak", "spouw", "vloer"],
    };

    const result = berekenIsolatie(multipleInput);

    expect(result.maatregelen).toHaveLength(3);
    expect(result.totaalGasBesparing).toBeGreaterThan(
      result.maatregelen[0]?.gasBesparing || 0
    );
  });

  it("should calculate different savings for different house types", () => {
    const appartementInput: IsolatieInput = {
      ...baseInput,
      woningType: "appartement",
    };

    const vrijstaandInput: IsolatieInput = {
      ...baseInput,
      woningType: "vrijstaand",
    };

    const appartementResult = berekenIsolatie(appartementInput);
    const vrijstaandResult = berekenIsolatie(vrijstaandInput);

    expect(vrijstaandResult.maatregelen[0]?.gasBesparing || 0).toBeGreaterThan(
      appartementResult.maatregelen[0]?.gasBesparing || 0
    );
  });

  it("should calculate payback time when investment costs are provided", () => {
    const withCosts: IsolatieInput = {
      ...baseInput,
      investeringsKosten: {
        dak: 5000,
      },
    };

    const result = berekenIsolatie(withCosts);

    expect(result.maatregelen[0]?.terugverdientijd).toBeDefined();
    expect(result.maatregelen[0]?.terugverdientijd).toBeGreaterThan(0);
  });

  it("should adjust payback time with subsidy", () => {
    const withSubsidy: IsolatieInput = {
      ...baseInput,
      investeringsKosten: {
        dak: 5000,
      },
      subsidieBedrag: 1000,
    };

    const withoutSubsidy: IsolatieInput = {
      ...baseInput,
      investeringsKosten: {
        dak: 5000,
      },
    };

    const withSubsidyResult = berekenIsolatie(withSubsidy);
    const withoutSubsidyResult = berekenIsolatie(withoutSubsidy);

    const withSubsidyPayback = withSubsidyResult.maatregelen[0]?.terugverdientijd;
    const withoutSubsidyPayback = withoutSubsidyResult.maatregelen[0]?.terugverdientijd;
    if (withSubsidyPayback && withoutSubsidyPayback) {
      expect(withSubsidyPayback).toBeLessThan(withoutSubsidyPayback);
    }

    expect(withSubsidyResult.totaalNettoInvesteringsKosten).toBeLessThan(
      withoutSubsidyResult.totaalInvesteringsKosten || Infinity
    );
  });

  it("should provide priority advice sorted by impact", () => {
    const multipleInput: IsolatieInput = {
      ...baseInput,
      maatregelen: ["dak", "spouw", "vloer"],
      investeringsKosten: {
        dak: 5000,
        spouw: 3000,
        vloer: 4000,
      },
    };

    const result = berekenIsolatie(multipleInput);

    expect(result.prioriteitAdvies).toBeDefined();
    expect(result.prioriteitAdvies?.length).toBeGreaterThan(1);

    // Check if sorted by impact (descending)
    if (result.prioriteitAdvies && result.prioriteitAdvies.length > 1) {
      for (let i = 0; i < result.prioriteitAdvies.length - 1; i++) {
        const current = result.prioriteitAdvies[i];
        const next = result.prioriteitAdvies[i + 1];
        if (current && next) {
          expect(current.impactScore).toBeGreaterThanOrEqual(next.impactScore);
        }
      }
    }
  });

  it("should calculate total investment costs", () => {
    const withCosts: IsolatieInput = {
      ...baseInput,
      maatregelen: ["dak", "spouw"],
      investeringsKosten: {
        dak: 5000,
        spouw: 3000,
      },
    };

    const result = berekenIsolatie(withCosts);

    expect(result.totaalInvesteringsKosten).toBe(8000);
  });

  it("should calculate net investment costs after subsidy", () => {
    const withSubsidy: IsolatieInput = {
      ...baseInput,
      maatregelen: ["dak", "spouw"],
      investeringsKosten: {
        dak: 5000,
        spouw: 3000,
      },
      subsidieBedrag: 2000,
    };

    const result = berekenIsolatie(withSubsidy);

    expect(result.totaalInvesteringsKosten).toBe(8000);
    expect(result.totaalNettoInvesteringsKosten).toBe(6000);
    expect(result.subsidieBedrag).toBe(2000);
  });

  it("should calculate new gas consumption", () => {
    const result = berekenIsolatie(baseInput);

    expect(result.nieuwGasVerbruik).toBeLessThan(baseInput.gasVerbruik);
    expect(result.nieuwGasVerbruik).toBe(
      baseInput.gasVerbruik - result.totaalGasBesparing
    );
  });
});

