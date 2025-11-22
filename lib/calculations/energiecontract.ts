export interface EnergiecontractInput {
  huidigStroomPrijs: number; // €/kWh
  huidigGasPrijs: number; // €/m³
  nieuwStroomPrijs: number; // €/kWh
  nieuwGasPrijs: number; // €/m³
  jaarverbruikStroom: number; // kWh
  jaarverbruikGas: number; // m³
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
}

export function berekenEnergiecontract(input: EnergiecontractInput): EnergiecontractResult {
  const {
    huidigStroomPrijs,
    huidigGasPrijs,
    nieuwStroomPrijs,
    nieuwGasPrijs,
    jaarverbruikStroom,
    jaarverbruikGas,
  } = input;

  // Huidige kosten
  const stroomKostenHuidig = jaarverbruikStroom * huidigStroomPrijs;
  const gasKostenHuidig = jaarverbruikGas * huidigGasPrijs;
  const huidigeKosten = stroomKostenHuidig + gasKostenHuidig;

  // Nieuwe kosten
  const stroomKostenNieuw = jaarverbruikStroom * nieuwStroomPrijs;
  const gasKostenNieuw = jaarverbruikGas * nieuwGasPrijs;
  const nieuweKosten = stroomKostenNieuw + gasKostenNieuw;

  // Verschil
  const verschil = nieuweKosten - huidigeKosten; // Negatief = besparing
  const verschilPercentage = (verschil / huidigeKosten) * 100;
  const maandelijksVerschil = verschil / 12;

  return {
    huidigeKosten: Math.round(huidigeKosten * 100) / 100,
    nieuweKosten: Math.round(nieuweKosten * 100) / 100,
    verschil: Math.round(verschil * 100) / 100,
    verschilPercentage: Math.round(verschilPercentage * 10) / 10,
    maandelijksVerschil: Math.round(maandelijksVerschil * 100) / 100,
    stroomKostenHuidig: Math.round(stroomKostenHuidig * 100) / 100,
    stroomKostenNieuw: Math.round(stroomKostenNieuw * 100) / 100,
    gasKostenHuidig: Math.round(gasKostenHuidig * 100) / 100,
    gasKostenNieuw: Math.round(gasKostenNieuw * 100) / 100,
  };
}
