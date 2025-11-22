export interface CvKetelInput {
  gasVerbruik: number; // m³/jaar
  huidigKetelType: "oud" | "redelijk" | "nieuw";
  aantalPersonen: number;
  gewenstSysteem: "hr-ketel" | "hybride";
  gasPrijs?: number; // €/m³
  stroomPrijs?: number; // €/kWh
}

export interface CvKetelResult {
  benodigdVermogen: number; // kW
  tapwaterAdvies: string; // CW-class
  huidigRendement: number; // %
  nieuwRendement: number; // %
  gasBesparing: number; // m³/jaar
  kostenBesparing: number; // €/jaar
  hybrideAdvies?: {
    warmtepompVermogen: number; // kW
    gasBesparing: number; // m³/jaar
    kostenBesparing: number; // €/jaar
  };
}

// Rendement per keteltype
const rendementen: Record<string, number> = {
  oud: 0.75, // 75%
  redelijk: 0.9, // 90%
  nieuw: 0.96, // 96%
};

// Tapwater advies per aantal personen
function getTapwaterAdvies(personen: number): string {
  if (personen <= 2) return "CW3 (20 kW tapwater)";
  if (personen <= 4) return "CW4 (25-30 kW tapwater)";
  return "CW5 (35-40 kW tapwater)";
}

export function berekenCvKetel(input: CvKetelInput): CvKetelResult {
  const {
    gasVerbruik,
    huidigKetelType,
    aantalPersonen,
    gewenstSysteem,
    gasPrijs = 1.2,
    stroomPrijs = 0.27,
  } = input;

  // Huidig rendement
  const huidigRendement = rendementen[huidigKetelType] || 0.9;

  // Nieuw rendement (HR-ketel)
  const nieuwRendement = 0.96; // 96%

  // Benodigd vermogen voor verwarming
  // (gasverbruik × 8) / 1650 = kW
  const benodigdVermogen = (gasVerbruik * 8) / 1650;

  // Tapwater advies
  const tapwaterAdvies = getTapwaterAdvies(aantalPersonen);

  // Gasbesparing door efficiëntere ketel
  // Factor = 1 - (huidig rendement / nieuw rendement)
  const besparingsFactor = 1 - huidigRendement / nieuwRendement;
  const gasBesparing = gasVerbruik * besparingsFactor;

  // Kostenbesparing
  const kostenBesparing = gasBesparing * gasPrijs;

  // Hybride advies (als gekozen)
  let hybrideAdvies;
  if (gewenstSysteem === "hybride") {
    // Hybride warmtepomp levert ~50% van warmte
    const hybrideWarmtepompVermogen = benodigdVermogen * 0.4; // 40% van totaal
    const hybrideGasBesparing = gasVerbruik * 0.5; // 50% minder gas
    const hybrideWarmteBehoefte = gasVerbruik * 9.5 * 0.5; // 50% van warmtebehoefte
    const hybrideStroomVerbruik = hybrideWarmteBehoefte / 4; // COP = 4
    const hybrideStroomKosten = hybrideStroomVerbruik * stroomPrijs;
    const hybrideGasKosten = (gasVerbruik - hybrideGasBesparing) * gasPrijs;
    const hybrideNieuweKosten = hybrideStroomKosten + hybrideGasKosten;
    const hybrideKostenBesparing = gasVerbruik * gasPrijs - hybrideNieuweKosten;

    hybrideAdvies = {
      warmtepompVermogen: Math.round(hybrideWarmtepompVermogen * 10) / 10,
      gasBesparing: Math.round(hybrideGasBesparing),
      kostenBesparing: Math.round(hybrideKostenBesparing * 100) / 100,
    };
  }

  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    tapwaterAdvies,
    huidigRendement: Math.round(huidigRendement * 100),
    nieuwRendement: Math.round(nieuwRendement * 100),
    gasBesparing: Math.round(gasBesparing),
    kostenBesparing: Math.round(kostenBesparing * 100) / 100,
    hybrideAdvies,
  };
}
