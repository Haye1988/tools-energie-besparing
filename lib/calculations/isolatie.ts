export interface IsolatieInput {
  woningType: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  gasVerbruik: number; // m³/jaar
  maatregelen: ("dak" | "spouw" | "vloer" | "glas")[];
  huidigGlasType?: "enkel" | "dubbel" | "hr";
  gasPrijs?: number; // €/m³ (default 1.20)
  huidigeIsolatieDak?: "geen" | "matig" | "goed";
  huidigeIsolatieSpouw?: "geen" | "matig" | "goed";
  huidigeIsolatieVloer?: "geen" | "matig" | "goed";
  bouwjaar?: number; // voor default isolatie status
  investeringsKosten?: {
    dak?: number;
    spouw?: number;
    vloer?: number;
    glas?: number;
  };
  subsidieBedrag?: number; // € (optioneel, totaal subsidie voor alle maatregelen)
}

export interface IsolatieMaatregelResult {
  maatregel: string;
  gasBesparing: number; // m³/jaar
  kostenBesparing: number; // €/jaar
  co2Reductie: number; // kg/jaar
  investeringsKosten?: number; // €
  terugverdientijd?: number; // jaren
}

export interface PrioriteitAdvies {
  maatregel: string;
  gasBesparing: number; // m³/jaar
  kostenBesparing: number; // €/jaar
  investeringsKosten: number; // €
  terugverdientijd: number; // jaren
  impactScore: number; // voor sortering
}

export interface IsolatieResult {
  maatregelen: IsolatieMaatregelResult[];
  totaalGasBesparing: number; // m³/jaar
  totaalKostenBesparing: number; // €/jaar
  totaalCo2Reductie: number; // kg/jaar
  nieuwGasVerbruik: number; // m³/jaar
  prioriteitAdvies?: PrioriteitAdvies[]; // gesorteerd op impact
  totaalInvesteringsKosten?: number; // €
  totaalNettoInvesteringsKosten?: number; // € (na subsidie)
  subsidieBedrag?: number; // €
}

// Gasbesparing per maatregel per woningtype (m³/jaar)
const besparingData: Record<string, Record<string, number>> = {
  dak: {
    appartement: 150,
    tussenwoning: 270,
    hoekwoning: 340,
    "2-onder-1-kap": 400,
    vrijstaand: 525,
  },
  spouw: {
    appartement: 100,
    tussenwoning: 180,
    hoekwoning: 400,
    "2-onder-1-kap": 410,
    vrijstaand: 600,
  },
  vloer: {
    appartement: 50,
    tussenwoning: 80,
    hoekwoning: 130,
    "2-onder-1-kap": 170,
    vrijstaand: 250,
  },
  glasEnkel: {
    appartement: 150,
    tussenwoning: 250,
    hoekwoning: 260,
    "2-onder-1-kap": 290,
    vrijstaand: 370,
  },
  glasDubbel: {
    appartement: 40,
    tussenwoning: 65,
    hoekwoning: 70,
    "2-onder-1-kap": 75,
    vrijstaand: 100,
  },
};

// Investeringskosten per maatregel (€)
const investeringsKostenDefaults: Record<string, { min: number; max: number }> = {
  dak: { min: 4000, max: 6000 },
  spouw: { min: 1000, max: 1000 },
  vloer: { min: 2000, max: 3000 },
  glas: { min: 150, max: 300 }, // per m², maar we gebruiken gemiddeld voor woningtype
};

// Bepaal default isolatiestatus op basis van bouwjaar
function getDefaultIsolatieStatus(bouwjaar?: number): {
  dak: "geen" | "matig" | "goed";
  spouw: "geen" | "matig" | "goed";
  vloer: "geen" | "matig" | "goed";
} {
  if (!bouwjaar) {
    return { dak: "geen", spouw: "geen", vloer: "geen" };
  }
  // Voor 1992: meestal geen isolatie
  if (bouwjaar < 1992) {
    return { dak: "geen", spouw: "geen", vloer: "geen" };
  }
  // 1992-2000: matige isolatie
  if (bouwjaar < 2000) {
    return { dak: "matig", spouw: "matig", vloer: "matig" };
  }
  // Na 2000: goede isolatie
  return { dak: "goed", spouw: "goed", vloer: "goed" };
}

// Correctiefactor voor huidige isolatie: als er al isolatie is, is de besparing kleiner
function getIsolatieCorrectieFactor(huidigeStatus: "geen" | "matig" | "goed"): number {
  switch (huidigeStatus) {
    case "geen":
      return 1.0; // Volledige besparing
    case "matig":
      return 0.5; // 50% van besparing (al deels geïsoleerd)
    case "goed":
      return 0.2; // 20% van besparing (al goed geïsoleerd)
  }
}

export function berekenIsolatie(input: IsolatieInput): IsolatieResult {
  const {
    woningType,
    gasVerbruik,
    maatregelen,
    huidigGlasType = "dubbel",
    gasPrijs = 1.2,
    huidigeIsolatieDak,
    huidigeIsolatieSpouw,
    huidigeIsolatieVloer,
    bouwjaar,
    investeringsKosten,
    subsidieBedrag = 0,
  } = input;

  // Bepaal huidige isolatiestatus
  const defaultStatus = getDefaultIsolatieStatus(bouwjaar);
  const huidigeDak = huidigeIsolatieDak || defaultStatus.dak;
  const huidigeSpouw = huidigeIsolatieSpouw || defaultStatus.spouw;
  const huidigeVloer = huidigeIsolatieVloer || defaultStatus.vloer;

  const resultaten: IsolatieMaatregelResult[] = [];
  const prioriteitLijst: PrioriteitAdvies[] = [];
  let totaalGasBesparing = 0;
  let totaalInvesteringsKosten = 0;
  let totaalNettoInvesteringsKosten = 0;

  for (const maatregel of maatregelen) {
    let gasBesparing = 0;
    let correctieFactor = 1.0;

    if (maatregel === "glas") {
      // Bepaal welke glas besparing te gebruiken
      const glasKey = huidigGlasType === "enkel" ? "glasEnkel" : "glasDubbel";
      gasBesparing = besparingData[glasKey]?.[woningType] || 0;
      // Glas heeft geen huidige isolatie status, maar wel huidig glastype
      correctieFactor = huidigGlasType === "hr" ? 0.3 : 1.0;
    } else if (maatregel === "dak") {
      gasBesparing = besparingData[maatregel]?.[woningType] || 0;
      correctieFactor = getIsolatieCorrectieFactor(huidigeDak);
    } else if (maatregel === "spouw") {
      gasBesparing = besparingData[maatregel]?.[woningType] || 0;
      correctieFactor = getIsolatieCorrectieFactor(huidigeSpouw);
    } else if (maatregel === "vloer") {
      gasBesparing = besparingData[maatregel]?.[woningType] || 0;
      correctieFactor = getIsolatieCorrectieFactor(huidigeVloer);
    }

    // Pas correctiefactor toe
    gasBesparing = gasBesparing * correctieFactor;

    if (gasBesparing > 0) {
      const kostenBesparing = gasBesparing * gasPrijs;
      const co2Reductie = gasBesparing * 1.8; // 1 m³ gas ≈ 1.8 kg CO2

      // Investeringskosten
      const kostenDefault = investeringsKostenDefaults[maatregel];
      const investering =
        investeringsKosten?.[maatregel as keyof typeof investeringsKosten] ||
        (kostenDefault ? (kostenDefault.min + kostenDefault.max) / 2 : 0);

      // Netto investering (na subsidie)
      const nettoInvestering = Math.max(0, investering - subsidieBedrag / maatregelen.length);

      // Terugverdientijd (op basis van netto investering)
      const terugverdientijd = kostenBesparing > 0 ? nettoInvestering / kostenBesparing : undefined;

      resultaten.push({
        maatregel,
        gasBesparing: Math.round(gasBesparing),
        kostenBesparing: Math.round(kostenBesparing * 100) / 100,
        co2Reductie: Math.round(co2Reductie),
        investeringsKosten: investering > 0 ? Math.round(investering) : undefined,
        terugverdientijd:
          terugverdientijd && terugverdientijd > 0
            ? Math.round(terugverdientijd * 10) / 10
            : undefined,
      });

      // Voor prioritering: impact score = gasbesparing / investering (hoe hoger, hoe beter)
      const impactScore = nettoInvestering > 0 ? gasBesparing / nettoInvestering : gasBesparing;
      prioriteitLijst.push({
        maatregel,
        gasBesparing: Math.round(gasBesparing),
        kostenBesparing: Math.round(kostenBesparing * 100) / 100,
        investeringsKosten: Math.round(nettoInvestering),
        terugverdientijd:
          terugverdientijd && terugverdientijd > 0 ? Math.round(terugverdientijd * 10) / 10 : 0,
        impactScore,
      });

      totaalGasBesparing += gasBesparing;
      totaalInvesteringsKosten += investering;
      totaalNettoInvesteringsKosten += nettoInvestering;
    }
  }

  // Combinatie-effect: als meerdere maatregelen, gebruik correctiefactor 0.85-0.90
  // (besparingen zijn niet simpel optelbaar)
  let combinatieFactor = 1.0;
  if (maatregelen.length > 1) {
    combinatieFactor = 0.87; // Gemiddelde tussen 0.85 en 0.90
  }
  const gecorrigeerdeGasBesparing = totaalGasBesparing * combinatieFactor;

  const totaalKostenBesparing = gecorrigeerdeGasBesparing * gasPrijs;
  const totaalCo2Reductie = gecorrigeerdeGasBesparing * 1.8;
  const nieuwGasVerbruik = Math.max(0, gasVerbruik - gecorrigeerdeGasBesparing);

  // Sorteer prioriteit lijst op impact score (hoogste eerst)
  prioriteitLijst.sort((a, b) => b.impactScore - a.impactScore);

  return {
    maatregelen: resultaten,
    totaalGasBesparing: Math.round(gecorrigeerdeGasBesparing),
    totaalKostenBesparing: Math.round(totaalKostenBesparing * 100) / 100,
    totaalCo2Reductie: Math.round(totaalCo2Reductie),
    nieuwGasVerbruik: Math.round(nieuwGasVerbruik),
    prioriteitAdvies: prioriteitLijst.length > 0 ? prioriteitLijst : undefined,
    totaalInvesteringsKosten:
      totaalInvesteringsKosten > 0 ? Math.round(totaalInvesteringsKosten) : undefined,
    totaalNettoInvesteringsKosten:
      totaalNettoInvesteringsKosten > 0 ? Math.round(totaalNettoInvesteringsKosten) : undefined,
    subsidieBedrag: subsidieBedrag > 0 ? subsidieBedrag : undefined,
  };
}
