export interface EnergiecontractInput {
  huidigStroomPrijs: number; // €/kWh
  huidigGasPrijs: number; // €/m³
  nieuwStroomPrijs: number; // €/kWh
  nieuwGasPrijs: number; // €/m³
  jaarverbruikStroom: number; // kWh
  jaarverbruikGas: number; // m³
  contractType?: "vast" | "variabel" | "dynamisch";
  vastrechtHuidig?: number; // €/jaar, default 250
  vastrechtNieuw?: number; // €/jaar, default 250
  netbeheerderKosten?: number; // €/jaar, default 300
  groeneStroom?: boolean; // default false
  prijsVerwachting?: "stabiel" | "stijgend" | "dalend";
}

export interface EnergiecontractResult {
  huidigeKosten: number; // €/jaar
  nieuweKosten: number; // €/jaar
  verschil: number; // €/jaar (negatief = besparing)
  verschilPercentage: number; // %
  maandelijksVerschil: number; // €/maand
  stroomKostenHuidig: number; // €/jaar
  stroomKostenNieuw: number; // €/jaar
  gasKostenHuidig: number; // €/jaar
  gasKostenNieuw: number; // €/jaar
  totaleKostenHuidig?: number; // inclusief vaste kosten
  totaleKostenNieuw?: number; // inclusief vaste kosten
  besparing3Jaar?: number; // €
  besparing5Jaar?: number; // €
}

export function berekenEnergiecontract(input: EnergiecontractInput): EnergiecontractResult {
  const {
    huidigStroomPrijs,
    huidigGasPrijs,
    nieuwStroomPrijs,
    nieuwGasPrijs,
    jaarverbruikStroom,
    jaarverbruikGas,
    contractType = "vast",
    vastrechtHuidig = 250,
    vastrechtNieuw = 250,
    netbeheerderKosten = 300,
    groeneStroom = false,
    prijsVerwachting = "stabiel",
  } = input;

  // Dynamische contracten: gemiddeld 34% lagere kosten
  let gecorrigeerdNieuwStroomPrijs = nieuwStroomPrijs;
  let gecorrigeerdNieuwGasPrijs = nieuwGasPrijs;
  if (contractType === "dynamisch") {
    gecorrigeerdNieuwStroomPrijs = nieuwStroomPrijs * 0.66; // 34% lager
    gecorrigeerdNieuwGasPrijs = nieuwGasPrijs * 0.66;
  }

  // Groene stroom: +5% op stroomprijs
  if (groeneStroom) {
    gecorrigeerdNieuwStroomPrijs = gecorrigeerdNieuwStroomPrijs * 1.05;
  }

  // Huidige kosten (variabel)
  const stroomKostenHuidig = jaarverbruikStroom * huidigStroomPrijs;
  const gasKostenHuidig = jaarverbruikGas * huidigGasPrijs;
  const variabeleKostenHuidig = stroomKostenHuidig + gasKostenHuidig;
  const totaleKostenHuidig = variabeleKostenHuidig + vastrechtHuidig + netbeheerderKosten;

  // Nieuwe kosten (variabel)
  const stroomKostenNieuw = jaarverbruikStroom * gecorrigeerdNieuwStroomPrijs;
  const gasKostenNieuw = jaarverbruikGas * gecorrigeerdNieuwGasPrijs;
  const variabeleKostenNieuw = stroomKostenNieuw + gasKostenNieuw;
  const totaleKostenNieuw = variabeleKostenNieuw + vastrechtNieuw + netbeheerderKosten;

  // Verschil (zonder vaste kosten voor vergelijking)
  const verschil = variabeleKostenNieuw - variabeleKostenHuidig; // Negatief = besparing
  const verschilPercentage = (verschil / variabeleKostenHuidig) * 100;
  const maandelijksVerschil = verschil / 12;

  // Besparing over meerdere jaren (met prijsverwachting)
  let prijsFactor3Jaar = 1.0;
  let prijsFactor5Jaar = 1.0;
  if (prijsVerwachting === "stijgend") {
    prijsFactor3Jaar = 1.1; // +10% over 3 jaar
    prijsFactor5Jaar = 1.2; // +20% over 5 jaar
  } else if (prijsVerwachting === "dalend") {
    prijsFactor3Jaar = 0.9; // -10% over 3 jaar
    prijsFactor5Jaar = 0.8; // -20% over 5 jaar
  }

  const besparing3Jaar = verschil * 3 * prijsFactor3Jaar;
  const besparing5Jaar = verschil * 5 * prijsFactor5Jaar;

  return {
    huidigeKosten: Math.round(variabeleKostenHuidig * 100) / 100,
    nieuweKosten: Math.round(variabeleKostenNieuw * 100) / 100,
    verschil: Math.round(verschil * 100) / 100,
    verschilPercentage: Math.round(verschilPercentage * 10) / 10,
    maandelijksVerschil: Math.round(maandelijksVerschil * 100) / 100,
    stroomKostenHuidig: Math.round(stroomKostenHuidig * 100) / 100,
    stroomKostenNieuw: Math.round(stroomKostenNieuw * 100) / 100,
    gasKostenHuidig: Math.round(gasKostenHuidig * 100) / 100,
    gasKostenNieuw: Math.round(gasKostenNieuw * 100) / 100,
    totaleKostenHuidig: Math.round(totaleKostenHuidig * 100) / 100,
    totaleKostenNieuw: Math.round(totaleKostenNieuw * 100) / 100,
    besparing3Jaar: Math.round(besparing3Jaar * 100) / 100,
    besparing5Jaar: Math.round(besparing5Jaar * 100) / 100,
  };
}
