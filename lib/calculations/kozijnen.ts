export interface KozijnenInput {
  oppervlakteRamen: number; // m²
  huidigGlasType: "enkel" | "dubbel" | "hr";
  kozijnMateriaal: "hout" | "kunststof" | "aluminium";
  gasVerbruik: number; // m³/jaar
  gasPrijs?: number; // €/m³
}

export interface KozijnenResult {
  huidigeUWaarde: number; // W/m²K
  nieuweUWaarde: number; // W/m²K
  warmteverliesReductie: number; // W/K
  gasBesparing: number; // m³/jaar
  kostenBesparing: number; // €/jaar
  co2Reductie: number; // kg/jaar
  comfortVerbetering: string;
}

// U-waarden per glastype (W/m²K)
const uWaarden: Record<string, number> = {
  enkel: 5.7,
  dubbel: 2.8,
  hr: 1.2, // HR++ of HR+++
};

// Nieuwe U-waarde (HR++ of triple)
const nieuweUWaarde = 1.1; // HR++

export function berekenKozijnen(input: KozijnenInput): KozijnenResult {
  const {
    oppervlakteRamen,
    huidigGlasType,
    gasVerbruik: _gasVerbruik,
    gasPrijs = 1.20,
  } = input;
  
  // Huidige en nieuwe U-waarde
  const huidigeUWaarde = uWaarden[huidigGlasType] || 2.8;
  
  // Warmteverlies reductie
  const warmteverliesReductie = (huidigeUWaarde - nieuweUWaarde) * oppervlakteRamen;
  
  // Gasbesparing (vereenvoudigde berekening)
  // Aanname: 1 W/K reductie ≈ 0.5 m³ gas/jaar besparing
  const gasBesparing = warmteverliesReductie * 0.5;
  
  // Kostenbesparing
  const kostenBesparing = gasBesparing * gasPrijs;
  
  // CO2 reductie
  const co2Reductie = gasBesparing * 1.8;
  
  // Comfort verbetering
  let comfortVerbetering = "Nieuwe kozijnen met HR++ glas verbeteren het comfort door:";
  comfortVerbetering += " minder tocht, betere geluidsisolatie, en minder condensvorming.";
  
  if (huidigGlasType === "enkel") {
    comfortVerbetering += " De verbetering is zeer significant ten opzichte van enkel glas.";
  }
  
  return {
    huidigeUWaarde: Math.round(huidigeUWaarde * 10) / 10,
    nieuweUWaarde: Math.round(nieuweUWaarde * 10) / 10,
    warmteverliesReductie: Math.round(warmteverliesReductie * 10) / 10,
    gasBesparing: Math.round(gasBesparing),
    kostenBesparing: Math.round(kostenBesparing * 100) / 100,
    co2Reductie: Math.round(co2Reductie),
    comfortVerbetering,
  };
}

