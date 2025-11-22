export interface BoilersInput {
  aantalPersonen: number;
  warmwaterBehoefte?: "laag" | "gemiddeld" | "hoog";
  huidigSysteem: "cv-boiler" | "elektrisch" | "geen";
  stroomPrijs?: number; // €/kWh
  gasPrijs?: number; // €/m³
}

export interface BoilersResult {
  aanbevolenVolume: number; // liter
  aanbevolenVermogen: number; // kW
  typeAdvies: "elektrisch" | "warmtepomp";
  jaarlijksVerbruik: number; // kWh of m³
  jaarlijkseKosten: number; // €
  besparingVsCv?: number; // €/jaar
  advies: string;
}

// Warmwater behoefte per persoon (liter/dag)
const warmwaterBehoeftePerPersoon: Record<string, number> = {
  laag: 30,
  gemiddeld: 50,
  hoog: 70,
};

// Volume advies (liter) per aantal personen
function getVolumeAdvies(personen: number, behoefte: string): number {
  const literPerPersoon = warmwaterBehoeftePerPersoon[behoefte] || 50;
  const totaalLiterPerDag = personen * literPerPersoon;
  // Buffer van 1.5x voor comfort
  return Math.ceil(totaalLiterPerDag * 1.5);
}

export function berekenBoilers(input: BoilersInput): BoilersResult {
  const {
    aantalPersonen,
    warmwaterBehoefte = "gemiddeld",
    huidigSysteem,
    stroomPrijs = 0.27,
    gasPrijs = 1.2,
  } = input;

  // Normaliseer warmwater behoefte
  const warmwaterBehoefteValue = warmwaterBehoefte ?? "gemiddeld";

  // Aanbevolen volume
  const aanbevolenVolume = getVolumeAdvies(aantalPersonen, warmwaterBehoefteValue);

  // Vermogen advies (kW) - voor opwarmen in redelijke tijd
  // Aanname: 100 liter opwarmen van 10°C naar 60°C in 1 uur ≈ 5.8 kW
  const aanbevolenVermogen = Math.max(2, (aanbevolenVolume / 100) * 5.8);

  // Type advies: warmtepompboiler is zuiniger maar duurder
  // Voor 4+ personen of hoog verbruik: warmtepomp
  // Anders: elektrisch
  const typeAdvies =
    aantalPersonen >= 4 || warmwaterBehoefteValue === "hoog" ? "warmtepomp" : "elektrisch";
  const literPerJaar =
    aantalPersonen * (warmwaterBehoeftePerPersoon[warmwaterBehoefteValue] || 50) * 365;
  const energiePerJaar_kWh = (literPerJaar * 4.186 * 50) / 3600; // 50°C temperatuurverschil

  let jaarlijksVerbruik: number;
  let jaarlijkseKosten: number;

  if (typeAdvies === "warmtepomp") {
    // Warmtepompboiler: COP ~3, dus 1/3 van energie
    jaarlijksVerbruik = energiePerJaar_kWh / 3;
    jaarlijkseKosten = jaarlijksVerbruik * stroomPrijs;
  } else {
    // Elektrische boiler: direct verbruik
    jaarlijksVerbruik = energiePerJaar_kWh;
    jaarlijkseKosten = jaarlijksVerbruik * stroomPrijs;
  }

  // Besparing vs CV-boiler
  let besparingVsCv: number | undefined;
  if (huidigSysteem === "cv-boiler") {
    // CV-boiler verbruikt gas: 1 m³ ≈ 9.5 kWh
    const cvVerbruik_m3 = energiePerJaar_kWh / 9.5;
    const cvKosten = cvVerbruik_m3 * gasPrijs;
    besparingVsCv = cvKosten - jaarlijkseKosten;
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
    advies,
  };
}
