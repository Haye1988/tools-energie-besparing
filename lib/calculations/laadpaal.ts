export interface LaadpaalInput {
  accuCapaciteit: number; // kWh
  gewensteLaadtijd: number; // uren
  huisaansluiting: "1-fase" | "3-fase";
  zonnepanelen?: boolean;
  stroomPrijs?: number; // €/kWh
}

export interface LaadpaalResult {
  benodigdVermogen: number; // kW
  adviesVermogen: number; // kW
  laadtijdBijAdvies: number; // uren
  laadtijdBij3_7kW: number; // uren
  laadtijdBij7_4kW: number; // uren
  laadtijdBij11kW: number; // uren
  kostenPerLading: number; // €
  advies: string;
}

// Standaard laadvermogens
const laadvermogens = {
  "1-fase": {
    "16A": 3.7, // kW
    "32A": 7.4, // kW
  },
  "3-fase": {
    "16A": 11, // kW (3x16A)
    "32A": 22, // kW (3x32A)
  },
};

export function berekenLaadpaal(input: LaadpaalInput): LaadpaalResult {
  const {
    accuCapaciteit,
    gewensteLaadtijd,
    huisaansluiting,
    stroomPrijs = 0.27,
  } = input;
  
  // Benodigd vermogen om in gewenste tijd te laden
  const benodigdVermogen = accuCapaciteit / gewensteLaadtijd;
  
  // Advies vermogen op basis van beschikbare aansluiting
  let adviesVermogen: number;
  
  if (huisaansluiting === "1-fase") {
    if (benodigdVermogen <= 3.7) {
      adviesVermogen = 3.7;
    } else if (benodigdVermogen <= 7.4) {
      adviesVermogen = 7.4;
    } else {
      adviesVermogen = 7.4; // Max voor 1-fase
    }
  } else {
    // 3-fase
    if (benodigdVermogen <= 7.4) {
      adviesVermogen = 7.4;
    } else if (benodigdVermogen <= 11) {
      adviesVermogen = 11;
    } else if (benodigdVermogen <= 22) {
      adviesVermogen = 22;
    } else {
      adviesVermogen = 22; // Max voor 3-fase
    }
  }
  
  // Laadtijden bij verschillende vermogens
  const laadtijdBijAdvies = accuCapaciteit / adviesVermogen;
  const laadtijdBij3_7kW = accuCapaciteit / 3.7;
  const laadtijdBij7_4kW = accuCapaciteit / 7.4;
  const laadtijdBij11kW = accuCapaciteit / 11;
  
  // Kosten per volledige lading
  const kostenPerLading = accuCapaciteit * stroomPrijs;
  
  // Advies tekst
  let advies = `Voor een ${accuCapaciteit} kWh accu en gewenste laadtijd van ${gewensteLaadtijd} uur is een ${adviesVermogen} kW laadpaal aanbevolen.`;
  advies += ` Hiermee duurt volledig laden ongeveer ${Math.round(laadtijdBijAdvies * 10) / 10} uur.`;
  
  if (huisaansluiting === "1-fase" && benodigdVermogen > 7.4) {
    advies += " Voor sneller laden is een 3-fase aansluiting nodig.";
  }
  
  if (input.zonnepanelen) {
    advies += " Met zonnepanelen kun je overdag laden op eigen zonnestroom voor extra besparing.";
  }
  
  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    adviesVermogen: Math.round(adviesVermogen * 10) / 10,
    laadtijdBijAdvies: Math.round(laadtijdBijAdvies * 10) / 10,
    laadtijdBij3_7kW: Math.round(laadtijdBij3_7kW * 10) / 10,
    laadtijdBij7_4kW: Math.round(laadtijdBij7_4kW * 10) / 10,
    laadtijdBij11kW: Math.round(laadtijdBij11kW * 10) / 10,
    kostenPerLading: Math.round(kostenPerLading * 100) / 100,
    advies,
  };
}

