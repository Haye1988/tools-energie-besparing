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
  rcWaardeDak?: number; // optioneel
  rcWaardeMuren?: number; // optioneel
  rcWaardeVloer?: number; // optioneel
  verwarmingType?: "radiatoren" | "vloerverwarming" | "beide";
  ventilatieType?: "natuurlijk" | "mechanisch" | "wtw";
}

export interface LabelNaMaatregel {
  maatregel: string;
  nieuwLabel: string;
  epgVerbetering: number;
}

export interface EnergielabelResult {
  huidigLabel: string; // A++ t/m G
  indicatiefLabel: string;
  epgWaarde: number; // Energieprestatie Gebouwen
  verbeterAdvies: string[];
  potentieleBesparing: number; // €/jaar
  warmteverliesPerOnderdeel?: {
    dak: number;
    muren: number;
    vloer: number;
    ramen: number;
    ventilatie: number;
  };
  labelNaMaatregel?: LabelNaMaatregel[];
  epcBerekeningUitleg?: string;
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

  // Warmteverlies per onderdeel (vereenvoudigd, in W/K)
  const warmteverliesPerOnderdeel = {
    dak: input.isolatieDak === "goed" ? 50 : input.isolatieDak === "matig" ? 100 : 200,
    muren: input.isolatieMuren === "goed" ? 80 : input.isolatieMuren === "matig" ? 150 : 300,
    vloer: input.isolatieVloer === "goed" ? 40 : input.isolatieVloer === "matig" ? 80 : 150,
    ramen: input.glasType === "hr" ? 20 : input.glasType === "dubbel" ? 50 : 100,
    ventilatie: input.ventilatieType === "wtw" ? 30 : input.ventilatieType === "mechanisch" ? 60 : 100,
  };

  // Verbeter advies
  const verbeterAdvies: string[] = [];
  const labelNaMaatregel: LabelNaMaatregel[] = [];

  if (input.isolatieDak === "geen" || input.isolatieDak === "matig") {
    verbeterAdvies.push("Dakisolatie verbeteren kan het label met 1-2 stappen verbeteren");
    const nieuweEpg = Math.max(0, epg - 15);
    labelNaMaatregel.push({
      maatregel: "Dakisolatie verbeteren",
      nieuwLabel: epgNaarLabel(nieuweEpg),
      epgVerbetering: 15,
    });
  }

  if (input.isolatieMuren === "geen" || input.isolatieMuren === "matig") {
    verbeterAdvies.push("Spouwmuurisolatie is een relatief goedkope maatregel met groot effect");
    const nieuweEpg = Math.max(0, epg - 20);
    labelNaMaatregel.push({
      maatregel: "Spouwmuurisolatie",
      nieuwLabel: epgNaarLabel(nieuweEpg),
      epgVerbetering: 20,
    });
  }

  if (input.glasType === "enkel" || input.glasType === "dubbel") {
    verbeterAdvies.push("HR++ glas plaatsen verbetert comfort en energielabel");
    const nieuweEpg = Math.max(0, epg - 10);
    labelNaMaatregel.push({
      maatregel: "HR++ glas",
      nieuwLabel: epgNaarLabel(nieuweEpg),
      epgVerbetering: 10,
    });
  }

  if (input.verwarmingssysteem === "cv-ketel") {
    verbeterAdvies.push(
      "Warmtepomp (hybride of all-electric) kan label met 2-3 stappen verbeteren"
    );
    const nieuweEpg = Math.max(0, epg - 30);
    labelNaMaatregel.push({
      maatregel: "Warmtepomp",
      nieuwLabel: epgNaarLabel(nieuweEpg),
      epgVerbetering: 30,
    });
  }

  if (!input.zonnepanelen) {
    verbeterAdvies.push("Zonnepanelen installeren verbetert het energielabel aanzienlijk");
    const nieuweEpg = Math.max(0, epg - 15);
    labelNaMaatregel.push({
      maatregel: "Zonnepanelen (5 kWp)",
      nieuwLabel: epgNaarLabel(nieuweEpg),
      epgVerbetering: 15,
    });
  }

  // Potentiële besparing (schatting)
  const potentieleBesparing = Math.max(0, (epg - 100) * 10); // €10 per EPG punt boven 100

  // EPC berekening uitleg
  const epcBerekeningUitleg = `De EPG (Energieprestatie Gebouwen) waarde van ${Math.round(epg)} wordt berekend op basis van:
- Bouwjaar en woningtype
- Isolatieniveau (dak, muren, vloer)
- Glastype
- Verwarmingssysteem
- Zonnepanelen

Lagere EPG = beter label. Elke maatregel verlaagt de EPG waarde.`;

  return {
    huidigLabel,
    indicatiefLabel: huidigLabel,
    epgWaarde: Math.round(epg),
    verbeterAdvies,
    potentieleBesparing: Math.round(potentieleBesparing),
    warmteverliesPerOnderdeel,
    labelNaMaatregel: labelNaMaatregel.length > 0 ? labelNaMaatregel : undefined,
    epcBerekeningUitleg,
  };
}
