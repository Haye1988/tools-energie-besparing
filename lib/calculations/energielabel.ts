export interface EnergielabelInput {
  bouwjaar: number;
  woningType: "appartement" | "tussenwoning" | "hoekwoning" | "2-onder-1-kap" | "vrijstaand";
  oppervlakte: number; // m²
  isolatieDak: "geen" | "matig" | "goed";
  isolatieMuren: "geen" | "matig" | "goed";
  isolatieVloer: "geen" | "matig" | "goed";
  glasType: "enkel" | "dubbel" | "hr";
  verwarmingssysteem: "cv-ketel" | "warmtepomp" | "hybride";
  zonnepanelen?: boolean;
  zonnepaneelVermogen?: number; // kWp
}

export interface EnergielabelResult {
  huidigLabel: string; // A++ t/m G
  indicatiefLabel: string;
  epgWaarde: number; // Energieprestatie Gebouwen
  verbeterAdvies: string[];
  potentieleBesparing: number; // €/jaar
}

// EPG waarde berekening (vereenvoudigd)
// Lagere EPG = beter label
function berekenEPG(input: EnergielabelInput): number {
  let epg = 200; // Startwaarde
  
  // Bouwjaar correctie
  if (input.bouwjaar < 1975) epg += 100;
  else if (input.bouwjaar < 1990) epg += 50;
  else if (input.bouwjaar < 2000) epg += 25;
  else if (input.bouwjaar < 2010) epg += 10;
  
  // Woningtype correctie
  const woningTypeFactoren: Record<string, number> = {
    appartement: -20,
    tussenwoning: 0,
    hoekwoning: 20,
    "2-onder-1-kap": 40,
    vrijstaand: 60,
  };
  epg += woningTypeFactoren[input.woningType] || 0;
  
  // Isolatie correcties
  if (input.isolatieDak === "geen") epg += 30;
  else if (input.isolatieDak === "matig") epg += 15;
  
  if (input.isolatieMuren === "geen") epg += 30;
  else if (input.isolatieMuren === "matig") epg += 15;
  
  if (input.isolatieVloer === "geen") epg += 20;
  else if (input.isolatieVloer === "matig") epg += 10;
  
  // Glas correctie
  if (input.glasType === "enkel") epg += 25;
  else if (input.glasType === "dubbel") epg += 10;
  
  // Verwarmingssysteem correctie
  if (input.verwarmingssysteem === "warmtepomp") epg -= 40;
  else if (input.verwarmingssysteem === "hybride") epg -= 20;
  
  // Zonnepanelen correctie
  if (input.zonnepanelen && input.zonnepaneelVermogen) {
    epg -= input.zonnepaneelVermogen * 5; // ~5 punten per kWp
  }
  
  return Math.max(0, epg);
}

// EPG naar label conversie
function epgNaarLabel(epg: number): string {
  if (epg <= 50) return "A++";
  if (epg <= 100) return "A+";
  if (epg <= 150) return "A";
  if (epg <= 200) return "B";
  if (epg <= 250) return "C";
  if (epg <= 300) return "D";
  if (epg <= 400) return "E";
  if (epg <= 500) return "F";
  return "G";
}

export function berekenEnergielabel(input: EnergielabelInput): EnergielabelResult {
  const epg = berekenEPG(input);
  const huidigLabel = epgNaarLabel(epg);
  
  // Verbeter advies
  const verbeterAdvies: string[] = [];
  
  if (input.isolatieDak === "geen" || input.isolatieDak === "matig") {
    verbeterAdvies.push("Dakisolatie verbeteren kan het label met 1-2 stappen verbeteren");
  }
  
  if (input.isolatieMuren === "geen" || input.isolatieMuren === "matig") {
    verbeterAdvies.push("Spouwmuurisolatie is een relatief goedkope maatregel met groot effect");
  }
  
  if (input.glasType === "enkel" || input.glasType === "dubbel") {
    verbeterAdvies.push("HR++ glas plaatsen verbetert comfort en energielabel");
  }
  
  if (input.verwarmingssysteem === "cv-ketel") {
    verbeterAdvies.push("Warmtepomp (hybride of all-electric) kan label met 2-3 stappen verbeteren");
  }
  
  if (!input.zonnepanelen) {
    verbeterAdvies.push("Zonnepanelen installeren verbetert het energielabel aanzienlijk");
  }
  
  // Potentiële besparing (schatting)
  const potentieleBesparing = Math.max(0, (epg - 100) * 10); // €10 per EPG punt boven 100
  
  return {
    huidigLabel,
    indicatiefLabel: huidigLabel,
    epgWaarde: Math.round(epg),
    verbeterAdvies,
    potentieleBesparing: Math.round(potentieleBesparing),
  };
}

