import { z } from "zod";

export const energielabelSchema = z.object({
  bouwjaar: z
    .number({ message: "Bouwjaar is verplicht" })
    .min(1900, "Minimaal 1900")
    .max(new Date().getFullYear(), "Kan niet in de toekomst liggen"),
  woningType: z.enum(["appartement", "tussenwoning", "hoekwoning", "2-onder-1-kap", "vrijstaand"], {
    message: "Woningtype is verplicht",
  }),
  oppervlakte: z
    .number({ message: "Oppervlakte is verplicht" })
    .min(20, "Minimaal 20 m²")
    .max(1000, "Maximaal 1.000 m²"),
  isolatieDak: z.enum(["geen", "matig", "goed"], {
    message: "Isolatie dak is verplicht",
  }),
  isolatieMuren: z.enum(["geen", "matig", "goed"], {
    message: "Isolatie muren is verplicht",
  }),
  isolatieVloer: z.enum(["geen", "matig", "goed"], {
    message: "Isolatie vloer is verplicht",
  }),
  glasType: z.enum(["enkel", "dubbel", "hr"], {
    message: "Glastype is verplicht",
  }),
  verwarmingssysteem: z.enum(["cv-ketel", "warmtepomp", "hybride"], {
    message: "Verwarmingssysteem is verplicht",
  }),
  zonnepanelen: z.boolean().optional(),
  zonnepaneelVermogen: z.number().min(0).max(100).optional(),
  rcWaardeDak: z.number().min(0).max(20).optional(),
  rcWaardeMuren: z.number().min(0).max(20).optional(),
  rcWaardeVloer: z.number().min(0).max(20).optional(),
  verwarmingType: z.enum(["radiatoren", "vloerverwarming", "beide"]).optional(),
  ventilatieType: z.enum(["natuurlijk", "mechanisch", "wtw"]).optional(),
});

export type EnergielabelFormData = z.infer<typeof energielabelSchema>;
