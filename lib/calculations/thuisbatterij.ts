export interface ThuisbatterijInput {
  zonnepaneelVermogen: number; // kWp
  jaarlijksVerbruik: number; // kWh
  jaarlijkseOpwekking?: number; // kWh (optioneel, anders berekend)
  doel: "eigen-verbruik" | "backup" | "dynamisch";
  gewensteAutonomie?: number; // uren (alleen voor backup)
  salderingActief?: boolean; // default true
  stroomPrijs?: number; // €/kWh
  terugleverVergoeding?: number; // €/kWh (default 0.08)
}

export interface ThuisbatterijResult {
  aanbevolenCapaciteit: number; // kWh
  minimaleCapaciteit: number; // kWh
  maximaleCapaciteit: number; // kWh
  eigenVerbruikZonder: number; // %
  eigenVerbruikMet: number; // %
  jaarlijkseBesparing: number; // €
  advies: string;
}

// Opbrengst per kWp per jaar (kWh/kWp)
const opbrengstPerkWp = 850;

export function berekenThuisbatterij(input: ThuisbatterijInput): ThuisbatterijResult {
  const {
    zonnepaneelVermogen,
    jaarlijksVerbruik,
    jaarlijkseOpwekking,
    doel,
    gewensteAutonomie = 4,
    salderingActief = true,
    stroomPrijs = 0.27,
    terugleverVergoeding = 0.08,
  } = input;
  
  // Jaarlijkse opwekking (als niet opgegeven)
  const opwekking = jaarlijkseOpwekking || (zonnepaneelVermogen * opbrengstPerkWp);
  
  // Zonder batterij: ~30-35% eigen verbruik
  const eigenVerbruikZonder = Math.min(jaarlijksVerbruik, opwekking * 0.35);
  const eigenVerbruikPercentageZonder = (eigenVerbruikZonder / opwekking) * 100;
  
  // Capaciteit berekening
  let aanbevolenCapaciteit: number;
  let minimaleCapaciteit: number;
  let maximaleCapaciteit: number;
  
  if (doel === "backup") {
    // Voor backup: gemiddeld verbruik per uur × gewenste uren
    const gemiddeldVerbruikPerUur = jaarlijksVerbruik / (365 * 24);
    const benodigdeCapaciteit = gemiddeldVerbruikPerUur * gewensteAutonomie;
    aanbevolenCapaciteit = Math.max(benodigdeCapaciteit, 5); // Minimaal 5 kWh
    minimaleCapaciteit = benodigdeCapaciteit;
    maximaleCapaciteit = benodigdeCapaciteit * 1.5;
  } else {
    // Voor eigen verbruik: 1.0 - 1.5 × kWp
    minimaleCapaciteit = zonnepaneelVermogen * 1.0;
    maximaleCapaciteit = zonnepaneelVermogen * 1.5;
    aanbevolenCapaciteit = zonnepaneelVermogen * 1.25;
  }
  
  // Met batterij: eigen verbruik stijgt naar ~60-70%
  const eigenVerbruikMet = Math.min(jaarlijksVerbruik, opwekking * 0.70);
  const eigenVerbruikPercentageMet = (eigenVerbruikMet / opwekking) * 100;
  
  // Financiële besparing
  let jaarlijkseBesparing = 0;
  
  if (!salderingActief) {
    // Extra zelfverbruik door batterij
    const extraZelfverbruik = eigenVerbruikMet - eigenVerbruikZonder;
    // Besparing = verschil tussen stroomprijs en terugleververgoeding
    jaarlijkseBesparing = extraZelfverbruik * (stroomPrijs - terugleverVergoeding);
  } else {
    // Met saldering is besparing beperkt (alleen terugleverkosten)
    const terugleverkosten = 0.13; // €/kWh
    const extraZelfverbruik = eigenVerbruikMet - eigenVerbruikZonder;
    jaarlijkseBesparing = extraZelfverbruik * terugleverkosten;
  }
  
  // Advies tekst
  let advies = `Voor ${zonnepaneelVermogen} kWp zonnepanelen is een batterij van ${Math.round(aanbevolenCapaciteit * 10) / 10} kWh aanbevolen (range: ${Math.round(minimaleCapaciteit * 10) / 10} - ${Math.round(maximaleCapaciteit * 10) / 10} kWh).`;
  advies += ` Zelfconsumptie stijgt van ${Math.round(eigenVerbruikPercentageZonder * 10) / 10}% naar ${Math.round(eigenVerbruikPercentageMet * 10) / 10}%.`;
  
  if (salderingActief) {
    advies += " Momenteel met saldering is de financiële besparing beperkt. Na afbouw saldering wordt een batterij financieel interessanter.";
  }
  
  return {
    aanbevolenCapaciteit: Math.round(aanbevolenCapaciteit * 10) / 10,
    minimaleCapaciteit: Math.round(minimaleCapaciteit * 10) / 10,
    maximaleCapaciteit: Math.round(maximaleCapaciteit * 10) / 10,
    eigenVerbruikZonder: Math.round(eigenVerbruikPercentageZonder * 10) / 10,
    eigenVerbruikMet: Math.round(eigenVerbruikPercentageMet * 10) / 10,
    jaarlijkseBesparing: Math.round(jaarlijkseBesparing * 100) / 100,
    advies,
  };
}

