export interface ZonnepanelenInput {
  jaarlijksVerbruik: number; // kWh
  dakOrientatie: "zuid" | "zuidoost" | "zuidwest" | "oost" | "west" | "noord";
  dakHellingshoek: number; // graden
  dakoppervlak?: number; // m² (optioneel)
  paneelVermogen: number; // Wp per paneel
  stroomPrijs: number; // €/kWh
}

export interface ZonnepanelenResult {
  benodigdVermogen: number; // kWp
  aantalPanelen: number;
  jaarlijkseOpwekking: number; // kWh
  jaarlijkseBesparing: number; // €
  terugverdientijd?: number; // jaren (indien investering bekend)
  dekkingPercentage: number; // % van verbruik
}

// Opbrengstfactor per oriëntatie (kWh per Wp per jaar)
const opbrengstFactoren: Record<string, number> = {
  zuid: 0.90,
  zuidoost: 0.85,
  zuidwest: 0.85,
  oost: 0.75,
  west: 0.75,
  noord: 0.50,
};

// Correctiefactor voor hellingshoek (35° is optimaal)
function getHellingshoekFactor(hoek: number): number {
  const optimaleHoek = 35;
  const verschil = Math.abs(hoek - optimaleHoek);
  if (verschil <= 10) return 1.0;
  if (verschil <= 20) return 0.95;
  if (verschil <= 30) return 0.90;
  return 0.85;
}

export function berekenZonnepanelen(input: ZonnepanelenInput): ZonnepanelenResult {
  const { jaarlijksVerbruik, dakOrientatie, dakHellingshoek, paneelVermogen, stroomPrijs } = input;
  
  // Basis opbrengstfactor voor oriëntatie
  const orientatieFactor = opbrengstFactoren[dakOrientatie] || 0.85;
  
  // Correctie voor hellingshoek
  const hellingshoekFactor = getHellingshoekFactor(dakHellingshoek);
  
  // Totale opbrengstfactor
  const opbrengstFactor = orientatieFactor * hellingshoekFactor;
  
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
  
  // Jaarlijkse besparing (uitgaande van volledige saldering)
  const jaarlijkseBesparing = Math.min(jaarlijkseOpwekking, jaarlijksVerbruik) * stroomPrijs;
  
  // Dekking percentage
  const dekkingPercentage = (jaarlijkseOpwekking / jaarlijksVerbruik) * 100;
  
  return {
    benodigdVermogen: Math.round(benodigdVermogen * 10) / 10,
    aantalPanelen,
    jaarlijkseOpwekking: Math.round(jaarlijkseOpwekking),
    jaarlijkseBesparing: Math.round(jaarlijkseBesparing * 100) / 100,
    dekkingPercentage: Math.round(dekkingPercentage * 10) / 10,
  };
}

