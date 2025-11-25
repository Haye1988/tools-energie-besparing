export interface LaadpaalInput {
  accuCapaciteit: number; // kWh
  gewensteLaadtijd: number; // uren
  huisaansluiting: "1-fase" | "3-fase";
  zonnepanelen?: boolean;
  evModel?: string; // optioneel, voor onboard lader check
  netaansluiting?: "25A" | "35A" | "onbekend";
  dynamischContract?: boolean; // default false
  dagTarief?: number; // €/kWh, default 0.35
  nachtTarief?: number; // €/kWh, default 0.20
}

// Populaire EV's en hun max onboard lader vermogen (kW)
const evOnboardLaders: Record<string, number> = {
  "Tesla Model 3": 11,
  "Tesla Model Y": 11,
  "Tesla Model S": 11,
  "Tesla Model X": 11,
  "Nissan Leaf": 6.6,
  "BMW i3": 11,
  "Hyundai Kona": 7.2,
  "Kia e-Niro": 7.2,
  "Volkswagen ID.3": 11,
  "Volkswagen ID.4": 11,
  "Audi e-tron": 11,
  "Mercedes EQC": 11,
};

export interface LaadpaalResult {
  benodigdVermogen: number; // kW
  adviesVermogen: number; // kW
  laadtijdBijAdvies: number; // uren
  laadtijdBij3_7kW: number; // uren
  laadtijdBij7_4kW: number; // uren
  laadtijdBij11kW: number; // uren
  kostenPerLading: number; // €
  maxOnboardLader?: number; // kW, als EV model bekend
  adviesLaadMoment?: "overdag" | "nacht" | "flexibel";
  maandelijkseKosten?: number; // €/maand
  advies: string;
}

// Standaard laadvermogens (voor toekomstig gebruik)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error - Reserved for future use
const _laadvermogens: Record<string, Record<string, number>> = {
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
    evModel,
    netaansluiting,
    dynamischContract = false,
    dagTarief = 0.35,
    nachtTarief = 0.20,
    zonnepanelen,
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

  // Onboard lader check
  const maxOnboardLader = evModel ? evOnboardLaders[evModel] : undefined;
  if (maxOnboardLader && adviesVermogen > maxOnboardLader) {
    // Waarschuwing: auto kan niet sneller laden
    adviesVermogen = maxOnboardLader;
  }

  // Netbeperkingen check
  if (netaansluiting === "25A" && adviesVermogen > 7.4) {
    // 25A kan max 7.4 kW (1-fase) of 11 kW (3-fase) aan
    if (huisaansluiting === "1-fase") {
      adviesVermogen = 7.4;
    }
  }

  // Advies laadmoment
  let adviesLaadMoment: "overdag" | "nacht" | "flexibel" = "flexibel";
  if (zonnepanelen) {
    adviesLaadMoment = "overdag";
  } else if (dynamischContract) {
    adviesLaadMoment = "nacht"; // Goedkoper 's nachts
  }

  // Kosten per lading (afhankelijk van tarief)
  const tariefVoorLading = adviesLaadMoment === "nacht" ? nachtTarief : dagTarief;
  const kostenPerLading = accuCapaciteit * tariefVoorLading;

  // Maandelijkse kosten (aanname: 1x per week volledig laden = ~4x per maand)
  const laadbeurtenPerMaand = 4;
  const maandelijkseKosten = kostenPerLading * laadbeurtenPerMaand;

  // Advies tekst
  let advies = `Voor een ${accuCapaciteit} kWh accu en gewenste laadtijd van ${gewensteLaadtijd} uur is een ${adviesVermogen} kW laadpaal aanbevolen.`;
  advies += ` Hiermee duurt volledig laden ongeveer ${Math.round(laadtijdBijAdvies * 10) / 10} uur.`;

  if (maxOnboardLader && adviesVermogen > maxOnboardLader) {
    advies += ` Let op: uw ${evModel} kan maximaal ${maxOnboardLader} kW laden.`;
  }

  if (huisaansluiting === "1-fase" && benodigdVermogen > 7.4) {
    advies += " Voor sneller laden is een 3-fase aansluiting nodig.";
  }

  if (zonnepanelen) {
    advies += " Met zonnepanelen kun je overdag laden op eigen zonnestroom voor extra besparing.";
  }

  if (dynamischContract) {
    advies += " Met een dynamisch contract kun je 's nachts goedkoper laden.";
  }

  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    adviesVermogen: Math.round(adviesVermogen * 10) / 10,
    laadtijdBijAdvies: Math.round(laadtijdBijAdvies * 10) / 10,
    laadtijdBij3_7kW: Math.round(laadtijdBij3_7kW * 10) / 10,
    laadtijdBij7_4kW: Math.round(laadtijdBij7_4kW * 10) / 10,
    laadtijdBij11kW: Math.round(laadtijdBij11kW * 10) / 10,
    kostenPerLading: Math.round(kostenPerLading * 100) / 100,
    maxOnboardLader,
    adviesLaadMoment,
    maandelijkseKosten: Math.round(maandelijkseKosten * 100) / 100,
    advies,
  };
}
