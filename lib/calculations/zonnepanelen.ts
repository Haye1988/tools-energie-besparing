export interface ZonnepanelenInput {
  jaarlijksVerbruik: number; // kWh
  dakOrientatie: "zuid" | "zuidoost" | "zuidwest" | "oost" | "west" | "noord";
  dakHellingshoek: number; // graden
  dakoppervlak?: number; // m² (optioneel)
  paneelVermogen: number; // Wp per paneel
  stroomPrijs: number; // €/kWh
  schaduwPercentage?: number; // 0-50, default 0
  investeringsKosten?: number; // € (optioneel)
  salderingActief?: boolean; // default true
  terugleverVergoeding?: number; // €/kWh, default 0.08
  thuisbatterij?: boolean; // default false
}

export interface ZonnepanelenResult {
  benodigdVermogen: number; // kWp
  aantalPanelen: number;
  jaarlijkseOpwekking: number; // kWh
  jaarlijkseBesparing: number; // €
  terugverdientijd?: number; // jaren (indien investering bekend)
  dekkingPercentage: number; // % van verbruik
  besparingMetSaldering?: number; // €/jaar
  besparingZonderSaldering?: number; // €/jaar
  zelfconsumptieMetBatterij?: number; // % (als batterij geselecteerd)
}

// Opbrengstfactor per oriëntatie (kWh per Wp per jaar) - verfijnd
const opbrengstFactoren: Record<string, number> = {
  zuid: 0.85, // Verfijnd van 0.9 naar 0.85
  zuidoost: 0.80,
  zuidwest: 0.80,
  oost: 0.70, // Verfijnd van 0.75 naar 0.70
  west: 0.70, // Verfijnd van 0.75 naar 0.70
  noord: 0.5,
};

// Correctiefactor voor hellingshoek (35° is optimaal)
function getHellingshoekFactor(hoek: number): number {
  const optimaleHoek = 35;
  const verschil = Math.abs(hoek - optimaleHoek);
  if (verschil <= 10) return 1.0;
  if (verschil <= 20) return 0.95;
  if (verschil <= 30) return 0.9;
  return 0.85;
}

export function berekenZonnepanelen(input: ZonnepanelenInput): ZonnepanelenResult {
  const {
    jaarlijksVerbruik,
    dakOrientatie,
    dakHellingshoek,
    paneelVermogen,
    stroomPrijs,
    schaduwPercentage = 0,
    investeringsKosten,
    salderingActief = true,
    terugleverVergoeding = 0.08,
    thuisbatterij = false,
  } = input;

  // Basis opbrengstfactor voor oriëntatie
  const orientatieFactor = opbrengstFactoren[dakOrientatie] || 0.85;

  // Correctie voor hellingshoek
  const hellingshoekFactor = getHellingshoekFactor(dakHellingshoek);

  // Schaduwfactor: verminder opbrengst met schaduwpercentage
  const schaduwFactor = 1 - schaduwPercentage / 100;

  // Totale opbrengstfactor
  const opbrengstFactor = orientatieFactor * hellingshoekFactor * schaduwFactor;

  // Opbrengst per kWp per jaar
  const opbrengstPerkWp = opbrengstFactor * 1000; // kWh/kWp/jaar

  // Benodigd vermogen om verbruik te dekken
  const benodigdVermogen = jaarlijksVerbruik / opbrengstPerkWp; // kWp

  // Aantal panelen nodig
  const aantalPanelen = Math.ceil((benodigdVermogen * 1000) / paneelVermogen);

  // Werkelijk geïnstalleerd vermogen
  const geinstalleerdVermogen = (aantalPanelen * paneelVermogen) / 1000; // kWp

  // Jaarlijkse opwekking
  const jaarlijkseOpwekking = geinstalleerdVermogen * opbrengstPerkWp; // kWh

  // Zelfconsumptie zonder batterij: ~30% van opwekking wordt direct gebruikt
  const zelfconsumptieZonder = Math.min(jaarlijksVerbruik, jaarlijkseOpwekking * 0.3);

  // Zelfconsumptie met batterij: ~65-70% van opwekking wordt gebruikt
  const zelfconsumptieMetBatterij = thuisbatterij
    ? Math.min(jaarlijksVerbruik, jaarlijkseOpwekking * 0.7)
    : zelfconsumptieZonder;
  const terugleveringMetBatterij = Math.max(0, jaarlijkseOpwekking - zelfconsumptieMetBatterij);

  // Besparing met saldering (100% saldering)
  const besparingMetSaldering =
    Math.min(jaarlijkseOpwekking, jaarlijksVerbruik) * stroomPrijs;

  // Besparing zonder saldering (terugleververgoeding)
  const besparingZonderSaldering =
    zelfconsumptieMetBatterij * stroomPrijs + terugleveringMetBatterij * terugleverVergoeding;

  // Standaard besparing (afhankelijk van saldering status)
  const jaarlijkseBesparing = salderingActief
    ? besparingMetSaldering
    : besparingZonderSaldering;

  // Terugverdientijd (indien investeringskosten bekend)
  let terugverdientijd: number | undefined;
  if (investeringsKosten && investeringsKosten > 0 && jaarlijkseBesparing > 0) {
    terugverdientijd = investeringsKosten / jaarlijkseBesparing;
  } else if (!investeringsKosten && geinstalleerdVermogen > 0) {
    // Schatting: ~€1000 per kWp
    const geschatteKosten = geinstalleerdVermogen * 1000;
    terugverdientijd = geschatteKosten / jaarlijkseBesparing;
  }

  // Dekking percentage
  const dekkingPercentage = (jaarlijkseOpwekking / jaarlijksVerbruik) * 100;

  // Zelfconsumptie percentage met batterij
  const zelfconsumptiePercentageMetBatterij = thuisbatterij
    ? (zelfconsumptieMetBatterij / jaarlijkseOpwekking) * 100
    : undefined;

  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    aantalPanelen,
    jaarlijkseOpwekking: Math.round(jaarlijkseOpwekking),
    jaarlijkseBesparing: Math.round(jaarlijkseBesparing * 100) / 100,
    terugverdientijd: terugverdientijd ? Math.round(terugverdientijd * 10) / 10 : undefined,
    dekkingPercentage: Math.round(dekkingPercentage * 10) / 10,
    besparingMetSaldering: Math.round(besparingMetSaldering * 100) / 100,
    besparingZonderSaldering: Math.round(besparingZonderSaldering * 100) / 100,
    zelfconsumptieMetBatterij: zelfconsumptiePercentageMetBatterij
      ? Math.round(zelfconsumptiePercentageMetBatterij * 10) / 10
      : undefined,
  };
}
