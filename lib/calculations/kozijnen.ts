export interface KozijnenInput {
  oppervlakteRamen: number; // m²
  huidigGlasType: "enkel" | "dubbel" | "hr";
  kozijnMateriaal: "hout" | "kunststof" | "aluminium";
  gasVerbruik: number; // m³/jaar
  gasPrijs?: number; // €/m³
  woningType?: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  bouwjaar?: number; // voor default glastype
  investeringsKosten?: number; // € (optioneel)
}

export interface KozijnenResult {
  huidigeUWaarde: number; // W/m²K
  nieuweUWaarde: number; // W/m²K
  warmteverliesReductie: number; // W/K
  gasBesparing: number; // m³/jaar
  kostenBesparing: number; // €/jaar
  co2Reductie: number; // kg/jaar
  comfortVerbetering: string;
  terugverdientijd?: number; // jaren
  investeringsKosten?: number; // €
}

// U-waarden per glastype (W/m²K)
const uWaarden: Record<string, number> = {
  enkel: 5.7,
  dubbel: 2.8,
  hr: 1.2, // HR++ of HR+++
};

// Nieuwe U-waarde (HR++ of triple)
const nieuweUWaarde = 1.1; // HR++

// Gasbesparing per m² per woningtype (m³/jaar per m²)
// Gebaseerd op Milieu Centraal: hoekwoning enkel→HR++ = 260 m³/jaar voor ~20 m² = 13 m³/m²
// Hoekwoning dubbel→HR++ = 65-70 m³/jaar voor ~20 m² = 3.25-3.5 m³/m²
const gasBesparingPerM2: Record<string, Record<string, number>> = {
  enkel: {
    // Enkel → HR++
    appartement: 6.5, // 50% van hoekwoning
    tussenwoning: 9.75, // 75% van hoekwoning
    hoekwoning: 13.0, // 260 m³ voor 20 m²
    "2-onder-1-kap": 14.5,
    vrijstaand: 16.0,
  },
  dubbel: {
    // Dubbel → HR++
    appartement: 1.6, // 50% van hoekwoning
    tussenwoning: 2.4, // 75% van hoekwoning
    hoekwoning: 3.25, // 65 m³ voor 20 m²
    "2-onder-1-kap": 3.5,
    vrijstaand: 4.0,
  },
  hr: {
    // HR → HR++ (kleine verbetering)
    appartement: 0.5,
    tussenwoning: 0.75,
    hoekwoning: 1.0,
    "2-onder-1-kap": 1.2,
    vrijstaand: 1.5,
  },
};

// Bepaal default glastype op basis van bouwjaar
function getDefaultGlasType(bouwjaar?: number): "enkel" | "dubbel" | "hr" {
  if (!bouwjaar) return "dubbel";
  if (bouwjaar < 1980) return "enkel";
  if (bouwjaar < 2000) return "dubbel";
  return "hr";
}

export function berekenKozijnen(input: KozijnenInput): KozijnenResult {
  const {
    oppervlakteRamen,
    huidigGlasType: inputGlasType,
    gasVerbruik: _gasVerbruik,
    gasPrijs = 1.2,
    woningType = "tussenwoning",
    bouwjaar,
    investeringsKosten,
  } = input;

  // Bepaal glastype (gebruik input of default op basis van bouwjaar)
  const huidigGlasType = inputGlasType || getDefaultGlasType(bouwjaar);

  // Huidige en nieuwe U-waarde
  const huidigeUWaarde = uWaarden[huidigGlasType] || 2.8;

  // Warmteverlies reductie
  const warmteverliesReductie = (huidigeUWaarde - nieuweUWaarde) * oppervlakteRamen;

  // Gasbesparing per m² per woningtype
  const besparingPerM2 = gasBesparingPerM2[huidigGlasType]?.[woningType] || 3.25;
  const gasBesparing = besparingPerM2 * oppervlakteRamen;

  // Kostenbesparing
  const kostenBesparing = gasBesparing * gasPrijs;

  // CO2 reductie
  const co2Reductie = gasBesparing * 1.8;

  // Investeringskosten (€150-300 per m², gemiddeld €225)
  const geschatteInvestering = investeringsKosten || oppervlakteRamen * 225;
  const investering = investeringsKosten || geschatteInvestering;

  // Terugverdientijd
  const terugverdientijd = kostenBesparing > 0 ? investering / kostenBesparing : undefined;

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
    terugverdientijd: terugverdientijd ? Math.round(terugverdientijd * 10) / 10 : undefined,
    investeringsKosten: Math.round(investering),
  };
}
