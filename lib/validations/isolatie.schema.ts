import { z } from "zod";

export const isolatieSchema = z.object({
  woningType: z.enum(["appartement", "tussenwoning", "hoekwoning", "2-onder-1-kap", "vrijstaand"], {
    message: "Woningtype is verplicht",
  }),
  gasVerbruik: z
    .number({ message: "Gasverbruik is verplicht" })
    .min(100, "Minimaal 100 m³/jaar")
    .max(10000, "Maximaal 10.000 m³/jaar"),
  maatregelen: z
    .array(z.enum(["dak", "spouw", "vloer", "glas"]))
    .min(1, "Selecteer minimaal één isolatiemaatregel"),
  huidigGlasType: z.enum(["enkel", "dubbel", "hr"]).optional(),
  gasPrijs: z.number().min(0.5).max(3.0).optional(),
  huidigeIsolatieDak: z.enum(["geen", "matig", "goed"]).optional(),
  huidigeIsolatieSpouw: z.enum(["geen", "matig", "goed"]).optional(),
  huidigeIsolatieVloer: z.enum(["geen", "matig", "goed"]).optional(),
  bouwjaar: z.number().min(1900).max(new Date().getFullYear()).optional(),
  investeringsKosten: z
    .object({
      dak: z.number().min(0).optional(),
      spouw: z.number().min(0).optional(),
      vloer: z.number().min(0).optional(),
      glas: z.number().min(0).optional(),
    })
    .optional(),
  subsidieBedrag: z.number().min(0).optional(),
});

export type IsolatieFormData = z.infer<typeof isolatieSchema>;
