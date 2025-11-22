export interface WarmtepompInput {
  gasVerbruik: number; // m³/jaar
  woningType: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  isolatieNiveau: "slecht" | "matig" | "goed";
  warmtepompType: "hybride" | "all-electric";
  gasPrijs: number; // €/m³
  stroomPrijs: number; // €/kWh
  cop?: number; // Coefficient of Performance (default 4)
}

export interface WarmtepompResult {
  benodigdVermogen: number; // kW
  stroomVerbruik: number; // kWh/jaar
  restGasVerbruik: number; // m³/jaar (bij hybride)
  huidigeKosten: number; // €/jaar
  nieuweKosten: number; // €/jaar
  nettoBesparing: number; // €/jaar
  gasBesparing: number; // m³/jaar
  co2Reductie: number; // kg/jaar
}

// Warmtebehoefte correctiefactoren per woningtype
const woningTypeFactoren: Record<string, number> = {
  appartement: 0.7,
  tussenwoning: 0.8,
  hoekwoning: 1.0,
  "2-onder-1-kap": 1.2,
  vrijstaand: 1.5,
};

// Isolatie correctiefactoren
const isolatieFactoren: Record<string, number> = {
  slecht: 1.1,
  matig: 1.0,
  goed: 0.9,
};

export function berekenWarmtepomp(input: WarmtepompInput): WarmtepompResult {
  const {
    gasVerbruik,
    woningType,
    isolatieNiveau,
    warmtepompType,
    gasPrijs,
    stroomPrijs,
    cop = 4,
  } = input;
  
  // Warmtebehoefte in kWh (1 m³ gas ≈ 9.5 kWh)
  const warmteBehoefte_kWh = gasVerbruik * 9.5;
  
  // Correctiefactoren toepassen
  const woningFactor = woningTypeFactoren[woningType] || 1.0;
  const isolatieFactor = isolatieFactoren[isolatieNiveau] || 1.0;
  
  // Gecorrigeerde warmtebehoefte
  const gecorrigeerdeWarmteBehoefte = warmteBehoefte_kWh * woningFactor * isolatieFactor;
  
  // Benodigd vermogen (kW) = (warmtebehoefte × 8) / 1650
  // 1650 = vollasturen per jaar in NL
  const benodigdVermogen = (gecorrigeerdeWarmteBehoefte * 8) / 1650;
  
  // Bij hybride: warmtepomp levert ~60% van warmte, ketel 40%
  // Bij all-electric: warmtepomp levert 100%
  const warmtepompDekking = warmtepompType === "hybride" ? 0.6 : 1.0;
  
  // Warmte geleverd door warmtepomp
  const warmtepompWarmte_kWh = gecorrigeerdeWarmteBehoefte * warmtepompDekking;
  
  // Stroomverbruik warmtepomp (warmte / COP)
  const stroomVerbruik = warmtepompWarmte_kWh / cop;
  
  // Rest gasverbruik (alleen bij hybride)
  const restGasVerbruik = warmtepompType === "hybride" 
    ? gasVerbruik * (1 - warmtepompDekking)
    : 0;
  
  // Kosten berekening
  const huidigeKosten = gasVerbruik * gasPrijs;
  const nieuweKosten = (stroomVerbruik * stroomPrijs) + (restGasVerbruik * gasPrijs);
  const nettoBesparing = huidigeKosten - nieuweKosten;
  
  // Gasbesparing
  const gasBesparing = gasVerbruik - restGasVerbruik;
  
  // CO2 reductie (1 m³ gas ≈ 1.8 kg CO2)
  const co2Reductie = gasBesparing * 1.8;
  
  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    stroomVerbruik: Math.round(stroomVerbruik),
    restGasVerbruik: Math.round(restGasVerbruik),
    huidigeKosten: Math.round(huidigeKosten * 100) / 100,
    nieuweKosten: Math.round(nieuweKosten * 100) / 100,
    nettoBesparing: Math.round(nettoBesparing * 100) / 100,
    gasBesparing: Math.round(gasBesparing),
    co2Reductie: Math.round(co2Reductie),
  };
}

