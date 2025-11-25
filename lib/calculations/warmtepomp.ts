export interface WarmtepompInput {
  gasVerbruik: number; // m³/jaar
  woningType: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  isolatieNiveau: "slecht" | "matig" | "goed";
  warmtepompType: "hybride" | "all-electric";
  gasPrijs: number; // €/m³
  stroomPrijs: number; // €/kWh
  cop?: number; // Coefficient of Performance (default 4, range 3-5)
  installatieKosten?: number; // € (optioneel, voor terugverdientijd)
  isolatieCorrectie?: number; // Extra isolatiecorrectie in % (0-50)
  subsidieBedrag?: number; // € (optioneel, voor terugverdientijd)
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
  matig: 1.0, // geen correctie
  goed: 0.9, // -10%
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
    isolatieCorrectie = 0,
    subsidieBedrag = 0,
  } = input;

  // Correctiefactoren toepassen
  const woningFactor = woningTypeFactoren[woningType] || 1.0;
  const isolatieFactor = isolatieFactoren[isolatieNiveau] || 1.0;

  // Extra isolatiecorrectie toepassen (0-50% reductie)
  const extraIsolatieCorrectie = 1 - Math.min(50, Math.max(0, isolatieCorrectie)) / 100;

  // Benodigd vermogen (kW) = (gasverbruik × 8 kWh/m³) / 1650 uur
  // 1650 = vollasturen per jaar in NL
  // Correctiefactoren worden toegepast op het basisvermogen
  const basisVermogen = (gasVerbruik * 8) / 1650;
  const benodigdVermogen = basisVermogen * woningFactor * isolatieFactor * extraIsolatieCorrectie;

  // Bij hybride: warmtepomp levert 40-50% van warmte (gebruik 45% als gemiddelde)
  // Bij all-electric: warmtepomp levert 100%
  const warmtepompDekking = warmtepompType === "hybride" ? 0.45 : 1.0;

  // Warmtebehoefte in kWh (1 m³ gas ≈ 8 kWh voor verwarming)
  const warmteBehoefte_kWh = gasVerbruik * 8;
  const gecorrigeerdeWarmteBehoefte =
    warmteBehoefte_kWh * woningFactor * isolatieFactor * extraIsolatieCorrectie;

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

  // Terugverdientijd (indien installatiekosten bekend, na subsidie)
  let terugverdientijd: number | undefined;
  const nettoInvestering = Math.max(0, (installatieKosten || 0) - subsidieBedrag);
  if (nettoInvestering > 0 && nettoBesparing > 0) {
    terugverdientijd = nettoInvestering / nettoBesparing;
  }

  // Scenario range: variëren op basis van COP, isolatie en stroomprijs
  // Optimistisch: betere isolatie, hogere COP, lagere stroomprijs
  // Pessimistisch: slechtere isolatie, lagere COP, hogere stroomprijs

  const copOptimistisch = Math.min(5, cop + 0.5); // +0.5 COP (max 5)
  const copPessimistisch = Math.max(3, cop - 0.5); // -0.5 COP (min 3)

  // Isolatie variaties: optimistisch = 1 niveau beter, pessimistisch = 1 niveau slechter
  const isolatieFactorOptimistisch =
    isolatieNiveau === "goed"
      ? 0.85 // Nog beter dan goed
      : isolatieNiveau === "matig"
        ? 0.9 // Goed niveau
        : 1.0; // Blijft slecht

  const isolatieFactorPessimistisch =
    isolatieNiveau === "slecht"
      ? 1.15 // Nog slechter
      : isolatieNiveau === "matig"
        ? 1.1 // Slecht niveau
        : 0.95; // Blijft goed

  // Stroomprijs variaties: ±10%
  const stroomPrijsOptimistisch = stroomPrijs * 0.9; // 10% lager
  const stroomPrijsPessimistisch = stroomPrijs * 1.1; // 10% hoger

  // Vermogen variaties
  const vermogenOptimistisch = basisVermogen * woningFactor * isolatieFactorOptimistisch;
  const vermogenPessimistisch = basisVermogen * woningFactor * isolatieFactorPessimistisch;

  // Warmtebehoefte variaties (met extra isolatiecorrectie)
  const warmteBehoefteOptimistisch =
    warmteBehoefte_kWh * woningFactor * isolatieFactorOptimistisch * extraIsolatieCorrectie;
  const warmteBehoeftePessimistisch =
    warmteBehoefte_kWh * woningFactor * isolatieFactorPessimistisch * extraIsolatieCorrectie;

  const warmteOptimistisch = warmteBehoefteOptimistisch * warmtepompDekking;
  const warmtePessimistisch = warmteBehoeftePessimistisch * warmtepompDekking;

  const stroomOptimistisch = warmteOptimistisch / copOptimistisch;
  const stroomPessimistisch = warmtePessimistisch / copPessimistisch;

  const kostenOptimistisch =
    stroomOptimistisch * stroomPrijsOptimistisch + restGasVerbruik * gasPrijs;
  const kostenPessimistisch =
    stroomPessimistisch * stroomPrijsPessimistisch + restGasVerbruik * gasPrijs;

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
