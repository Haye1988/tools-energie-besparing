import { describe, it, expect } from "vitest";
import { berekenKozijnen, type KozijnenInput } from "@/lib/calculations/kozijnen";

describe("berekenKozijnen", () => {
  const baseInput: KozijnenInput = {
    oppervlakteRamen: 20,
    woningType: "tussenwoning",
    huidigGlasType: "dubbel",
    kozijnMateriaal: "kunststof",
    gasVerbruik: 1200,
    gasPrijs: 1.2,
  };

  it("should calculate savings for window replacement", () => {
    const result = berekenKozijnen(baseInput);

    expect(result.gasBesparing).toBeGreaterThan(0);
    expect(result.kostenBesparing).toBeGreaterThan(0);
    expect(result.co2Reductie).toBeGreaterThan(0);
    expect(result.huidigeUWaarde).toBeGreaterThan(result.nieuweUWaarde);
  });

  it("should calculate different savings for different glass types", () => {
    const enkelInput: KozijnenInput = {
      ...baseInput,
      huidigGlasType: "enkel",
    };

    const hrInput: KozijnenInput = {
      ...baseInput,
      huidigGlasType: "hr",
    };

    const enkelResult = berekenKozijnen(enkelInput);
    const hrResult = berekenKozijnen(hrInput);

    expect(enkelResult.gasBesparing).toBeGreaterThan(hrResult.gasBesparing);
  });

  it("should calculate different savings for different house types", () => {
    const appartementInput: KozijnenInput = {
      ...baseInput,
      woningType: "appartement",
    };

    const hoekwoningInput: KozijnenInput = {
      ...baseInput,
      woningType: "hoekwoning",
    };

    const appartementResult = berekenKozijnen(appartementInput);
    const hoekwoningResult = berekenKozijnen(hoekwoningInput);

    expect(hoekwoningResult.gasBesparing).toBeGreaterThan(
      appartementResult.gasBesparing
    );
  });

  it("should calculate payback time when investment costs are provided", () => {
    const withCosts: KozijnenInput = {
      ...baseInput,
      investeringsKosten: 4500,
    };

    const result = berekenKozijnen(withCosts);

    expect(result.terugverdientijd).toBeDefined();
    expect(result.terugverdientijd).toBeGreaterThan(0);
  });

  it("should use estimated investment costs when not provided", () => {
    const result = berekenKozijnen(baseInput);

    expect(result.investeringsKosten).toBeDefined();
    expect(result.investeringsKosten).toBeGreaterThan(0);
    // Estimated: €225 per m²
    expect(result.investeringsKosten).toBeCloseTo(baseInput.oppervlakteRamen * 225, -2);
  });

  it("should calculate CO2 reduction correctly", () => {
    const result = berekenKozijnen(baseInput);

    // CO2 reduction should be approximately 1.8 kg per m³ gas
    expect(result.co2Reductie).toBeCloseTo(result.gasBesparing * 1.8, 0);
  });

  it("should calculate heat loss reduction", () => {
    const result = berekenKozijnen(baseInput);

    expect(result.warmteverliesReductie).toBeGreaterThan(0);
    // Account for rounding (result is rounded to 1 decimal)
    const expectedReduction = (result.huidigeUWaarde - result.nieuweUWaarde) * baseInput.oppervlakteRamen;
    expect(result.warmteverliesReductie).toBeCloseTo(expectedReduction, 1);
  });

  it("should provide comfort improvement text", () => {
    const result = berekenKozijnen(baseInput);

    expect(result.comfortVerbetering).toBeDefined();
    expect(result.comfortVerbetering.length).toBeGreaterThan(0);
  });
});

