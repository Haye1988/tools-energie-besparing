import { z } from "zod";

export const boilersSchema = z.object({
  aantalPersonen: z
    .number({ message: "Aantal personen is verplicht" })
    .min(1, "Minimaal 1 persoon")
    .max(20, "Maximaal 20 personen"),
  warmwaterBehoefte: z.enum(["laag", "gemiddeld", "hoog"]).optional(),
  huidigSysteem: z.enum(["cv-boiler", "elektrisch", "geen"], {
    message: "Huidig systeem is verplicht",
  }),
  stroomPrijs: z.number().min(0.1).max(1.0).optional(),
  gasPrijs: z.number().min(0.5).max(3.0).optional(),
  doucheMinutenPerDag: z.number().min(0).max(120).optional(),
  aantalBadenPerWeek: z.number().min(0).max(20).optional(),
  boilerLocatie: z.enum(["binnen", "buiten", "ventilatielucht"]).optional(),
  investeringsKosten: z.number().min(0).optional(),
});

export type BoilersFormData = z.infer<typeof boilersSchema>;
