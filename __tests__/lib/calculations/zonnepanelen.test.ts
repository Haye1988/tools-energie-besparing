import { describe, it, expect } from "vitest";
import { berekenZonnepanelen, type ZonnepanelenInput } from "@/lib/calculations/zonnepanelen";

describe("berekenZonnepanelen", () => {
  const baseInput: ZonnepanelenInput = {
    jaarlijksVerbruik: 3500,
    dakOrientatie: "zuid",
    dakHellingshoek: 35,
    paneelVermogen: 400,
    stroomPrijs: 0.3,
  };

  it("should calculate correct number of panels for south orientation", () => {
    const result = berekenZonnepanelen(baseInput);

    expect(result.aantalPanelen).toBeGreaterThan(0);
    expect(result.benodigdVermogen).toBeGreaterThan(0);
    expect(result.jaarlijkseOpwekking).toBeGreaterThan(0);
    expect(result.jaarlijkseBesparing).toBeGreaterThan(0);
    expect(result.dekkingPercentage).toBeGreaterThan(0);
  });

  it("should calculate lower output for north orientation", () => {
    const northInput: ZonnepanelenInput = {
      ...baseInput,
      dakOrientatie: "noord",
    };

    const southResult = berekenZonnepanelen(baseInput);
    const northResult = berekenZonnepanelen(northInput);

    expect(northResult.jaarlijkseOpwekking).toBeLessThan(
      southResult.jaarlijkseOpwekking
    );
  });

  it("should handle different panel powers", () => {
    const smallPanelInput: ZonnepanelenInput = {
      ...baseInput,
      paneelVermogen: 300,
    };

    const largePanelInput: ZonnepanelenInput = {
      ...baseInput,
      paneelVermogen: 500,
    };

    const smallResult = berekenZonnepanelen(smallPanelInput);
    const largeResult = berekenZonnepanelen(largePanelInput);

    expect(largeResult.aantalPanelen).toBeLessThan(smallResult.aantalPanelen);
    expect(largeResult.benodigdVermogen).toBeCloseTo(
      smallResult.benodigdVermogen,
      1
    );
  });

  it("should calculate savings based on electricity price", () => {
    const lowPriceInput: ZonnepanelenInput = {
      ...baseInput,
      stroomPrijs: 0.2,
    };

    const highPriceInput: ZonnepanelenInput = {
      ...baseInput,
      stroomPrijs: 0.4,
    };

    const lowPriceResult = berekenZonnepanelen(lowPriceInput);
    const highPriceResult = berekenZonnepanelen(highPriceInput);

    expect(highPriceResult.jaarlijkseBesparing).toBeGreaterThan(
      lowPriceResult.jaarlijkseBesparing
    );
  });

  it("should handle edge cases", () => {
    const edgeCaseInput: ZonnepanelenInput = {
      jaarlijksVerbruik: 1000,
      dakOrientatie: "oost",
      dakHellingshoek: 45,
      paneelVermogen: 200,
      stroomPrijs: 0.25,
    };

    const result = berekenZonnepanelen(edgeCaseInput);

    expect(result.aantalPanelen).toBeGreaterThan(0);
    expect(result.jaarlijkseOpwekking).toBeGreaterThan(0);
    expect(result.dekkingPercentage).toBeGreaterThanOrEqual(0);
  });
});

