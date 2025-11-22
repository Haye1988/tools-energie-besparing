export interface IsolatieInput {
  woningType: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  gasVerbruik: number; // m³/jaar
  maatregelen: ("dak" | "spouw" | "vloer" | "glas")[];
  huidigGlasType?: "enkel" | "dubbel" | "hr";
  gasPrijs?: number; // €/m³ (default 1.20)
}

export interface IsolatieMaatregelResult {
  maatregel: string;
  gasBesparing: number; // m³/jaar
  kostenBesparing: number; // €/jaar
  co2Reductie: number; // kg/jaar
}

export interface IsolatieResult {
  maatregelen: IsolatieMaatregelResult[];
  totaalGasBesparing: number; // m³/jaar
  totaalKostenBesparing: number; // €/jaar
  totaalCo2Reductie: number; // kg/jaar
  nieuwGasVerbruik: number; // m³/jaar
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

export function berekenIsolatie(input: IsolatieInput): IsolatieResult {
  const { woningType, gasVerbruik, maatregelen, huidigGlasType = "dubbel", gasPrijs = 1.2 } = input;

  const resultaten: IsolatieMaatregelResult[] = [];
  let totaalGasBesparing = 0;

  for (const maatregel of maatregelen) {
    let gasBesparing = 0;

    if (maatregel === "glas") {
      // Bepaal welke glas besparing te gebruiken
      const glasKey = huidigGlasType === "enkel" ? "glasEnkel" : "glasDubbel";
      gasBesparing = besparingData[glasKey]?.[woningType] || 0;
    } else {
      gasBesparing = besparingData[maatregel]?.[woningType] || 0;
    }

    if (gasBesparing > 0) {
      const kostenBesparing = gasBesparing * gasPrijs;
      const co2Reductie = gasBesparing * 1.8; // 1 m³ gas ≈ 1.8 kg CO2

      resultaten.push({
        maatregel,
        gasBesparing: Math.round(gasBesparing),
        kostenBesparing: Math.round(kostenBesparing * 100) / 100,
        co2Reductie: Math.round(co2Reductie),
      });

      totaalGasBesparing += gasBesparing;
    }
  }

  const totaalKostenBesparing = totaalGasBesparing * gasPrijs;
  const totaalCo2Reductie = totaalGasBesparing * 1.8;
  const nieuwGasVerbruik = Math.max(0, gasVerbruik - totaalGasBesparing);

  return {
    maatregelen: resultaten,
    totaalGasBesparing: Math.round(totaalGasBesparing),
    totaalKostenBesparing: Math.round(totaalKostenBesparing * 100) / 100,
    totaalCo2Reductie: Math.round(totaalCo2Reductie),
    nieuwGasVerbruik: Math.round(nieuwGasVerbruik),
  };
}
