export interface AircoInput {
  oppervlakte: number; // m²
  hoogte: number; // m
  isolatieNiveau: "goed" | "gemiddeld" | "slecht";
  toepassing: "koelen" | "koelen-verwarmen";
  koelurenPerJaar?: number; // uren (default 720 = 8u/dag × 90 dagen)
  stroomPrijs?: number; // €/kWh (default 0.27)
  aantalPersonen?: number; // default 2
  raamOppervlak?: number; // m² (optioneel)
  zonInstraling?: "geen" | "matig" | "veel";
  aantalRuimtes?: number; // 1-5, voor multi-split advies
}

export interface AircoResult {
  benodigdVermogen: number; // kW
  benodigdVermogenBTU: number; // BTU
  ruimteInhoud: number; // m³
  jaarlijksVerbruik: number; // kWh
  jaarlijkseKosten: number; // €
  adviesType?: "split" | "multi-split";
  co2Impact?: number; // kg/jaar
  advies: string;
}

// Vermogen per m³ ruimte (W/m³) per isolatieniveau
const vermogenPerM3: Record<string, number> = {
  goed: 30,
  gemiddeld: 40,
  slecht: 50,
};

export function berekenAirco(input: AircoInput): AircoResult {
  const {
    oppervlakte,
    hoogte,
    isolatieNiveau,
    koelurenPerJaar = 720,
    stroomPrijs = 0.27,
    aantalPersonen = 2,
    raamOppervlak,
    zonInstraling = "matig",
    aantalRuimtes = 1,
  } = input;

  // Ruimte inhoud
  const ruimteInhoud = oppervlakte * hoogte; // m³

  // Vermogen per m³
  const vermogenPerM3Factor = vermogenPerM3[isolatieNiveau] || 40;

  // Correcties voor extra factoren
  // Aantal personen: +100W per persoon
  const personenCorrectie = (aantalPersonen - 2) * 100; // basis is 2 personen

  // Zoninstraling correctie
  const zonCorrecties: Record<string, number> = {
    geen: 0,
    matig: 0.1, // +10%
    veel: 0.2, // +20%
  };
  const zonCorrectie = zonCorrecties[zonInstraling] || 0.1;

  // Raamoppervlak correctie (als opgegeven)
  let raamCorrectie = 0;
  if (raamOppervlak) {
    // Grote ramen = meer warmtewinst, +5W per m² raam
    raamCorrectie = raamOppervlak * 5;
  }

  // Totaal vermogen in Watt
  const basisVermogenWatt = ruimteInhoud * vermogenPerM3Factor;
  const gecorrigeerdVermogenWatt =
    basisVermogenWatt * (1 + zonCorrectie) + personenCorrectie + raamCorrectie;

  // Omzetten naar kW
  let benodigdVermogen = gecorrigeerdVermogenWatt / 1000;

  // Beperkingsmelding: waarschuw bij <2 kW of >7 kW
  if (benodigdVermogen < 2) {
    // Te laag, gebruik minimum
    benodigdVermogen = 2;
  }
  // Note: >7 kW wordt afgehandeld in advies tekst

  // Omzetten naar BTU (1 kW = 3412 BTU)
  const benodigdVermogenBTU = benodigdVermogen * 3412;

  // Advies type: split vs multi-split
  const adviesType: "split" | "multi-split" = aantalRuimtes > 1 ? "multi-split" : "split";

  // Energieverbruik per jaar
  // Vaste airco: ~0.75 kWh/uur na opstarten (verfijnd van 0.5 × vermogen)
  const verbruikPerUur = benodigdVermogen * 0.75; // Verfijnd van 0.5
  const jaarlijksVerbruik = verbruikPerUur * koelurenPerJaar;

  // Jaarlijkse kosten
  const jaarlijkseKosten = jaarlijksVerbruik * stroomPrijs;

  // CO2 impact (1 kWh ≈ 0.5 kg CO2 in NL)
  const co2Impact = jaarlijksVerbruik * 0.5;

  // Advies tekst
  let advies = `Voor een ruimte van ${Math.round(ruimteInhoud)} m³ met ${isolatieNiveau} isolatie is een ${adviesType === "multi-split" ? "multi-split" : "split"} airco van ongeveer ${Math.round(benodigdVermogen * 10) / 10} kW (${Math.round(benodigdVermogenBTU / 1000)}k BTU) geschikt.`;

  if (benodigdVermogen < 2 || benodigdVermogen > 7) {
    advies += " Raadpleeg een expert voor advies op maat.";
  }

  if (isolatieNiveau === "slecht") {
    advies += " Overweeg eerst isolatie te verbeteren voor betere energie-efficiëntie.";
  }

  if (aantalRuimtes > 1) {
    advies += ` Voor ${aantalRuimtes} ruimtes is een multi-split systeem aanbevolen.`;
  }

  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    benodigdVermogenBTU: Math.round(benodigdVermogenBTU),
    ruimteInhoud: Math.round(ruimteInhoud),
    jaarlijksVerbruik: Math.round(jaarlijksVerbruik),
    jaarlijkseKosten: Math.round(jaarlijkseKosten * 100) / 100,
    adviesType,
    co2Impact: Math.round(co2Impact),
    advies,
  };
}
