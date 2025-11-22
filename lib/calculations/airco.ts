export interface AircoInput {
  oppervlakte: number; // m²
  hoogte: number; // m
  isolatieNiveau: "goed" | "gemiddeld" | "slecht";
  toepassing: "koelen" | "koelen-verwarmen";
  koelurenPerJaar?: number; // uren (default 720 = 8u/dag × 90 dagen)
  stroomPrijs?: number; // €/kWh (default 0.27)
}

export interface AircoResult {
  benodigdVermogen: number; // kW
  benodigdVermogenBTU: number; // BTU
  ruimteInhoud: number; // m³
  jaarlijksVerbruik: number; // kWh
  jaarlijkseKosten: number; // €
  advies: string;
}

// Vermogen per m³ ruimte (W/m³) per isolatieniveau
const vermogenPerM3: Record<string, number> = {
  goed: 30,
  gemiddeld: 40,
  slecht: 50,
};

export function berekenAirco(input: AircoInput): AircoResult {
  const { oppervlakte, hoogte, isolatieNiveau, koelurenPerJaar = 720, stroomPrijs = 0.27 } = input;

  // Ruimte inhoud
  const ruimteInhoud = oppervlakte * hoogte; // m³

  // Vermogen per m³
  const vermogenPerM3Factor = vermogenPerM3[isolatieNiveau] || 40;

  // Benodigd koelvermogen in Watt
  const vermogenWatt = ruimteInhoud * vermogenPerM3Factor;

  // Omzetten naar kW
  const benodigdVermogen = vermogenWatt / 1000;

  // Omzetten naar BTU (1 kW = 3412 BTU)
  const benodigdVermogenBTU = benodigdVermogen * 3412;

  // Energieverbruik per jaar
  // Vaste airco: ~0.75 kWh/uur na opstarten
  // Mobiele airco: ~2-3 kWh/uur
  // We nemen gemiddeld 1.5 kWh/uur voor berekening
  const verbruikPerUur = benodigdVermogen * 0.5; // Conservatieve schatting
  const jaarlijksVerbruik = verbruikPerUur * koelurenPerJaar;

  // Jaarlijkse kosten
  const jaarlijkseKosten = jaarlijksVerbruik * stroomPrijs;

  // Advies tekst
  let advies = `Voor een ruimte van ${Math.round(ruimteInhoud)} m³ met ${isolatieNiveau} isolatie is een airco van ongeveer ${Math.round(benodigdVermogen * 10) / 10} kW (${Math.round(benodigdVermogenBTU / 1000)}k BTU) geschikt.`;

  if (isolatieNiveau === "slecht") {
    advies += " Overweeg eerst isolatie te verbeteren voor betere energie-efficiëntie.";
  }

  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    benodigdVermogenBTU: Math.round(benodigdVermogenBTU),
    ruimteInhoud: Math.round(ruimteInhoud),
    jaarlijksVerbruik: Math.round(jaarlijksVerbruik),
    jaarlijkseKosten: Math.round(jaarlijkseKosten * 100) / 100,
    advies,
  };
}
