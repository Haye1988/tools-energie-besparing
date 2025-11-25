import { describe, it, expect } from "vitest";
import { berekenCvKetel, type CvKetelInput } from "@/lib/calculations/cv-ketel";

describe("berekenCvKetel", () => {
  const baseInput: CvKetelInput = {
    gasVerbruik: 1200,
    huidigKetelType: "redelijk",
    aantalPersonen: 4,
    gewenstSysteem: "hr-ketel",
    gasPrijs: 1.2,
    stroomPrijs: 0.27,
  };

  it("should calculate savings for boiler replacement", () => {
    const result = berekenCvKetel(baseInput);

    expect(result.benodigdVermogen).toBeGreaterThan(0);
    expect(result.gasBesparing).toBeGreaterThan(0);
    expect(result.kostenBesparing).toBeGreaterThan(0);
    expect(result.nieuwRendement).toBeGreaterThan(result.huidigRendement);
  });

  it("should calculate different savings for different boiler types", () => {
    const oudInput: CvKetelInput = {
      ...baseInput,
      huidigKetelType: "oud",
    };

    const nieuwInput: CvKetelInput = {
      ...baseInput,
      huidigKetelType: "nieuw",
    };

    const oudResult = berekenCvKetel(oudInput);
    const nieuwResult = berekenCvKetel(nieuwInput);

    expect(oudResult.gasBesparing).toBeGreaterThan(nieuwResult.gasBesparing);
  });

  it("should provide tapwater advice based on number of people", () => {
    const tweePersonen: CvKetelInput = {
      ...baseInput,
      aantalPersonen: 2,
    };

    const vijfPersonen: CvKetelInput = {
      ...baseInput,
      aantalPersonen: 5,
    };

    const tweeResult = berekenCvKetel(tweePersonen);
    const vijfResult = berekenCvKetel(vijfPersonen);

    expect(tweeResult.tapwaterAdvies).toContain("CW3");
    expect(vijfResult.tapwaterAdvies).toContain("CW5");
  });

  it("should provide replacement advice for old boilers", () => {
    const oudInput: CvKetelInput = {
      ...baseInput,
      huidigKetelType: "oud",
      ketelLeeftijd: 20,
    };

    const result = berekenCvKetel(oudInput);

    expect(result.vervangingsAdvies).toBe(true);
  });

  it("should not provide replacement advice for new boilers", () => {
    const nieuwInput: CvKetelInput = {
      ...baseInput,
      huidigKetelType: "nieuw",
      ketelLeeftijd: 5,
    };

    const result = berekenCvKetel(nieuwInput);

    expect(result.vervangingsAdvies).toBe(false);
  });

  it("should calculate payback time when installation costs are provided", () => {
    const withCosts: CvKetelInput = {
      ...baseInput,
      installatieKosten: 2500,
    };

    const result = berekenCvKetel(withCosts);

    expect(result.terugverdientijd).toBeDefined();
    expect(result.terugverdientijd).toBeGreaterThan(0);
  });

  it("should provide hybrid advice when hybrid system is selected", () => {
    const hybrideInput: CvKetelInput = {
      ...baseInput,
      gewenstSysteem: "hybride",
    };

    const result = berekenCvKetel(hybrideInput);

    expect(result.hybrideAdvies).toBeDefined();
    expect(result.hybrideAdvies?.warmtepompVermogen).toBeGreaterThan(0);
    expect(result.hybrideAdvies?.gasBesparing).toBeGreaterThan(0);
    expect(result.hybrideAdvies?.kostenBesparing).toBeGreaterThan(0);
  });

  it("should not provide hybrid advice for HR-boiler system", () => {
    const result = berekenCvKetel(baseInput);

    expect(result.hybrideAdvies).toBeUndefined();
  });

  it("should calculate correct efficiency values", () => {
    const result = berekenCvKetel(baseInput);

    // Rendement is returned as percentage (0-100), not decimal (0-1)
    expect(result.huidigRendement).toBeGreaterThanOrEqual(75);
    expect(result.huidigRendement).toBeLessThanOrEqual(96);
    expect(result.nieuwRendement).toBe(96);
  });
});

