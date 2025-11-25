import { z } from "zod";

export const kozijnenSchema = z.object({
  oppervlakteRamen: z
    .number({ message: "Oppervlakte ramen is verplicht" })
    .min(1, "Minimaal 1 m²")
    .max(200, "Maximaal 200 m²"),
  woningType: z.enum(["appartement", "tussenwoning", "hoekwoning", "2-onder-1-kap", "vrijstaand"], {
    message: "Woningtype is verplicht",
  }),
  huidigGlasType: z.enum(["enkel", "dubbel", "hr"], {
    message: "Huidig glastype is verplicht",
  }),
  kozijnMateriaal: z.enum(["hout", "kunststof", "aluminium"], {
    message: "Kozijn materiaal is verplicht",
  }),
  gasVerbruik: z
    .number({ message: "Gasverbruik is verplicht" })
    .min(100, "Minimaal 100 m³/jaar")
    .max(10000, "Maximaal 10.000 m³/jaar"),
  gasPrijs: z.number().min(0.5).max(3.0).optional(),
  bouwjaar: z.number().min(1900).max(new Date().getFullYear()).optional(),
  investeringsKosten: z.number().min(0).optional(),
});

export type KozijnenFormData = z.infer<typeof kozijnenSchema>;
