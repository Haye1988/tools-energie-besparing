export interface WarmtepompInput {
  gasVerbruik: number; // m³/jaar
  woningType: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  isolatieNiveau: "slecht" | "matig" | "goed";
  warmtepompType: "hybride" | "all-electric";
  gasPrijs: number; // €/m³
  stroomPrijs: number; // €/kWh
  cop?: number; // Coefficient of Performance (default 4, range 3-5)
  installatieKosten?: number; // € (optioneel, voor terugverdientijd)
}

export interface ScenarioRange {
  optimistisch: number;
  normaal: number;
  pessimistisch: number;
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
  terugverdientijd?: number; // jaren (indien installatieKosten bekend)
  scenarioRange?: {
    vermogen: ScenarioRange;
    besparing: ScenarioRange;
  };
}

// Warmtebehoefte correctiefactoren per woningtype
const woningTypeFactoren: Record<string, number> = {
  appartement: 0.7,
  tussenwoning: 0.8,
  hoekwoning: 1.0,
  "2-onder-1-kap": 1.2,
  vrijstaand: 1.5,
};

// Isolatie correctiefactoren: +10% bij slecht, -10% bij goed
const isolatieFactoren: Record<string, number> = {
  slecht: 1.1, // +10%
  matig: 1.0,  // geen correctie
  goed: 0.9,   // -10%
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
    installatieKosten,
  } = input;

  // Correctiefactoren toepassen
  const woningFactor = woningTypeFactoren[woningType] || 1.0;
  const isolatieFactor = isolatieFactoren[isolatieNiveau] || 1.0;

  // Benodigd vermogen (kW) = (gasverbruik × 8 kWh/m³) / 1650 uur
  // 1650 = vollasturen per jaar in NL
  // Correctiefactoren worden toegepast op het basisvermogen
  const basisVermogen = (gasVerbruik * 8) / 1650;
  const benodigdVermogen = basisVermogen * woningFactor * isolatieFactor;

  // Bij hybride: warmtepomp levert 40-50% van warmte (gebruik 45% als gemiddelde)
  // Bij all-electric: warmtepomp levert 100%
  const warmtepompDekking = warmtepompType === "hybride" ? 0.45 : 1.0;

  // Warmtebehoefte in kWh (1 m³ gas ≈ 8 kWh voor verwarming)
  const warmteBehoefte_kWh = gasVerbruik * 8;
  const gecorrigeerdeWarmteBehoefte = warmteBehoefte_kWh * woningFactor * isolatieFactor;

  // Warmte geleverd door warmtepomp
  const warmtepompWarmte_kWh = gecorrigeerdeWarmteBehoefte * warmtepompDekking;

  // Stroomverbruik warmtepomp (warmte / COP)
  const stroomVerbruik = warmtepompWarmte_kWh / cop;

  // Rest gasverbruik (alleen bij hybride)
  const restGasVerbruik = warmtepompType === "hybride" ? gasVerbruik * (1 - warmtepompDekking) : 0;

  // Kosten berekening
  const huidigeKosten = gasVerbruik * gasPrijs;
  const nieuweKosten = stroomVerbruik * stroomPrijs + restGasVerbruik * gasPrijs;
  const nettoBesparing = huidigeKosten - nieuweKosten;

  // Gasbesparing
  const gasBesparing = gasVerbruik - restGasVerbruik;

  // CO2 reductie (1 m³ gas ≈ 1.8 kg CO2)
  const co2Reductie = gasBesparing * 1.8;

  // Terugverdientijd (indien installatiekosten bekend)
  let terugverdientijd: number | undefined;
  if (installatieKosten && installatieKosten > 0 && nettoBesparing > 0) {
    terugverdientijd = installatieKosten / nettoBesparing;
  }

  // Scenario range: optimistisch (COP 5, goede isolatie), normaal (COP 4), pessimistisch (COP 3, slechte isolatie)
  const copOptimistisch = 5;
  const copPessimistisch = 3;
  const isolatieFactorOptimistisch = isolatieNiveau === "goed" ? 0.9 : 1.0;
  const isolatieFactorPessimistisch = isolatieNiveau === "slecht" ? 1.1 : 1.0;

  const vermogenOptimistisch = basisVermogen * woningFactor * isolatieFactorOptimistisch;
  const vermogenPessimistisch = basisVermogen * woningFactor * isolatieFactorPessimistisch;

  const warmteOptimistisch = gecorrigeerdeWarmteBehoefte * warmtepompDekking;
  const warmtePessimistisch = gecorrigeerdeWarmteBehoefte * warmtepompDekking;

  const stroomOptimistisch = warmteOptimistisch / copOptimistisch;
  const stroomPessimistisch = warmtePessimistisch / copPessimistisch;

  const kostenOptimistisch = stroomOptimistisch * stroomPrijs + restGasVerbruik * gasPrijs;
  const kostenPessimistisch = stroomPessimistisch * stroomPrijs + restGasVerbruik * gasPrijs;

  const besparingOptimistisch = huidigeKosten - kostenOptimistisch;
  const besparingPessimistisch = huidigeKosten - kostenPessimistisch;

  const scenarioRange = {
    vermogen: {
      optimistisch: Math.round(vermogenOptimistisch * 10) / 10,
      normaal: Math.round(benodigdVermogen * 10) / 10,
      pessimistisch: Math.round(vermogenPessimistisch * 10) / 10,
    },
    besparing: {
      optimistisch: Math.round(besparingOptimistisch * 100) / 100,
      normaal: Math.round(nettoBesparing * 100) / 100,
      pessimistisch: Math.round(besparingPessimistisch * 100) / 100,
    },
  };

  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    stroomVerbruik: Math.round(stroomVerbruik),
    restGasVerbruik: Math.round(restGasVerbruik),
    huidigeKosten: Math.round(huidigeKosten * 100) / 100,
    nieuweKosten: Math.round(nieuweKosten * 100) / 100,
    nettoBesparing: Math.round(nettoBesparing * 100) / 100,
    gasBesparing: Math.round(gasBesparing),
    co2Reductie: Math.round(co2Reductie),
    terugverdientijd: terugverdientijd ? Math.round(terugverdientijd * 10) / 10 : undefined,
    scenarioRange,
  };
}
