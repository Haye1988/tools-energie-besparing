export interface BoilersInput {
  aantalPersonen: number;
  warmwaterBehoefte?: "laag" | "gemiddeld" | "hoog";
  huidigSysteem: "cv-boiler" | "elektrisch" | "geen";
  stroomPrijs?: number; // €/kWh
  gasPrijs?: number; // €/m³
  doucheMinutenPerDag?: number; // minuten, default 8
  aantalBadenPerWeek?: number; // default 0
  boilerLocatie?: "binnen" | "buiten" | "ventilatielucht";
  investeringsKosten?: number; // € (optioneel)
}

export interface VergelijkingSystemen {
  elektrisch: {
    verbruik: number; // kWh/jaar
    kosten: number; // €/jaar
  };
  cv: {
    verbruik: number; // m³/jaar
    kosten: number; // €/jaar
  };
  warmtepomp: {
    verbruik: number; // kWh/jaar
    kosten: number; // €/jaar
  };
}

export interface BoilersResult {
  aanbevolenVolume: number; // liter
  aanbevolenVermogen: number; // kW
  typeAdvies: "elektrisch" | "warmtepomp";
  jaarlijksVerbruik: number; // kWh of m³
  jaarlijkseKosten: number; // €
  besparingVsCv?: number; // €/jaar
  vergelijkingSystemen?: VergelijkingSystemen;
  terugverdientijd?: number; // jaren
  legionellaVerbruik?: number; // kWh/jaar voor bijverwarmen
  advies: string;
}

// Warmwater behoefte per persoon (liter/dag) - verfijnd naar ~40 L
const warmwaterBehoeftePerPersoon: Record<string, number> = {
  laag: 30,
  gemiddeld: 40, // Verfijnd van 50 naar 40
  hoog: 60, // Verfijnd van 70 naar 60
};

// SCOP (Seizoensgebonden COP) per locatie
const scopWaarden: Record<string, number> = {
  binnen: 3.5, // Binnen: hoogste rendement
  ventilatielucht: 3.0, // Ventilatielucht: goed rendement
  buiten: 2.5, // Buiten: lager rendement (kouder)
};

// Volume advies (liter) per aantal personen - inline berekening gebruikt

export function berekenBoilers(input: BoilersInput): BoilersResult {
  const {
    aantalPersonen,
    warmwaterBehoefte = "gemiddeld",
    huidigSysteem,
    stroomPrijs = 0.27,
    gasPrijs = 1.2,
    doucheMinutenPerDag = 8,
    aantalBadenPerWeek = 0,
    boilerLocatie = "binnen",
    investeringsKosten,
  } = input;

  // Normaliseer warmwater behoefte
  const warmwaterBehoefteValue = warmwaterBehoefte ?? "gemiddeld";

  // Bereken warmwater verbruik op basis van douchegewoonten
  // Douche: ~7 L/min, bad: ~150 L
  const doucheVerbruikPerDag = (doucheMinutenPerDag * 7 * aantalPersonen) / 1000; // m³
  const badVerbruikPerDag = (aantalBadenPerWeek * 150 * aantalPersonen) / (7 * 1000); // m³
  const totaalVerbruikPerDag =
    doucheVerbruikPerDag + badVerbruikPerDag + (aantalPersonen * 5) / 1000; // +5L per persoon voor keuken
  const literPerDag = totaalVerbruikPerDag * 1000;

  // Gebruik berekend verbruik of standaard waarde
  const literPerPersoonPerDag = literPerDag / aantalPersonen;
  const gebruikteBehoefte =
    literPerPersoonPerDag > 0
      ? literPerPersoonPerDag
      : warmwaterBehoeftePerPersoon[warmwaterBehoefteValue] || 40;

  // Aanbevolen volume
  const aanbevolenVolume = Math.ceil(aantalPersonen * gebruikteBehoefte * 1.5);

  // Vermogen advies (kW) - voor opwarmen in redelijke tijd
  // Aanname: 100 liter opwarmen van 10°C naar 60°C in 1 uur ≈ 5.8 kW
  const aanbevolenVermogen = Math.max(2, (aanbevolenVolume / 100) * 5.8);

  // Type advies: warmtepompboiler is zuiniger maar duurder
  // Voor 4+ personen of hoog verbruik: warmtepomp
  // Anders: elektrisch
  const typeAdvies =
    aantalPersonen >= 4 || warmwaterBehoefteValue === "hoog" ? "warmtepomp" : "elektrisch";
  const literPerJaar = aantalPersonen * gebruikteBehoefte * 365;
  const energiePerJaar_kWh = (literPerJaar * 4.186 * 50) / 3600; // 50°C temperatuurverschil

  // SCOP voor warmtepompboiler
  const scop = scopWaarden[boilerLocatie] || 3.0;

  // Vergelijking systemen
  // Elektrische boiler
  const elektrischVerbruik = energiePerJaar_kWh;
  const elektrischKosten = elektrischVerbruik * stroomPrijs;

  // CV-boiler
  const cvVerbruik_m3 = energiePerJaar_kWh / 9.5;
  const cvKosten = cvVerbruik_m3 * gasPrijs;

  // Warmtepompboiler
  const warmtepompVerbruik = energiePerJaar_kWh / scop;
  // Legionella bijverwarmen: 1x per week tot 60°C, ~2 kWh per keer
  const legionellaVerbruik = 2 * 52; // 52 weken
  const totaalWarmtepompVerbruik = warmtepompVerbruik + legionellaVerbruik;
  const warmtepompKosten = totaalWarmtepompVerbruik * stroomPrijs;

  const vergelijkingSystemen: VergelijkingSystemen = {
    elektrisch: {
      verbruik: Math.round(elektrischVerbruik),
      kosten: Math.round(elektrischKosten * 100) / 100,
    },
    cv: {
      verbruik: Math.round(cvVerbruik_m3),
      kosten: Math.round(cvKosten * 100) / 100,
    },
    warmtepomp: {
      verbruik: Math.round(totaalWarmtepompVerbruik),
      kosten: Math.round(warmtepompKosten * 100) / 100,
    },
  };

  let jaarlijksVerbruik: number;
  let jaarlijkseKosten: number;

  if (typeAdvies === "warmtepomp") {
    jaarlijksVerbruik = totaalWarmtepompVerbruik;
    jaarlijkseKosten = warmtepompKosten;
  } else {
    jaarlijksVerbruik = elektrischVerbruik;
    jaarlijkseKosten = elektrischKosten;
  }

  // Besparing vs CV-boiler
  let besparingVsCv: number | undefined;
  if (huidigSysteem === "cv-boiler") {
    besparingVsCv = cvKosten - jaarlijkseKosten;
  }

  // Terugverdientijd (indien investeringskosten bekend)
  let terugverdientijd: number | undefined;
  if (investeringsKosten && investeringsKosten > 0 && besparingVsCv && besparingVsCv > 0) {
    terugverdientijd = investeringsKosten / besparingVsCv;
  }

  // Advies tekst
  let advies = `Voor ${aantalPersonen} personen is een ${aanbevolenVolume} liter boiler aanbevolen.`;
  advies += ` Type: ${typeAdvies === "warmtepomp" ? "warmtepompboiler" : "elektrische boiler"}.`;
  advies += ` Jaarlijkse kosten: ongeveer €${Math.round(jaarlijkseKosten)}.`;

  if (besparingVsCv && besparingVsCv > 0) {
    advies += ` Besparing ten opzichte van CV-boiler: €${Math.round(besparingVsCv)} per jaar.`;
  }

  return {
    aanbevolenVolume,
    aanbevolenVermogen: Math.round(aanbevolenVermogen * 10) / 10,
    typeAdvies,
    jaarlijksVerbruik: Math.round(jaarlijksVerbruik),
    jaarlijkseKosten: Math.round(jaarlijkseKosten * 100) / 100,
    besparingVsCv: besparingVsCv ? Math.round(besparingVsCv * 100) / 100 : undefined,
    vergelijkingSystemen,
    terugverdientijd: terugverdientijd ? Math.round(terugverdientijd * 10) / 10 : undefined,
    legionellaVerbruik: Math.round(legionellaVerbruik),
    advies,
  };
}
