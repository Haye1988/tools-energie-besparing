import { z } from "zod";

export const warmtepompSchema = z.object({
  gasVerbruik: z
    .number({ message: "Gasverbruik is verplicht" })
    .min(100, "Minimaal 100 m³/jaar")
    .max(10000, "Maximaal 10.000 m³/jaar"),
  woningType: z.enum(["appartement", "tussenwoning", "hoekwoning", "2-onder-1-kap", "vrijstaand"], {
    message: "Woningtype is verplicht",
  }),
  isolatieNiveau: z.enum(["slecht", "matig", "goed"], {
    message: "Isolatieniveau is verplicht",
  }),
  warmtepompType: z.enum(["hybride", "all-electric"], {
    message: "Warmtepomp type is verplicht",
  }),
  gasPrijs: z
    .number({ message: "Gasprijs is verplicht" })
    .min(0.5, "Minimaal €0.50/m³")
    .max(3.0, "Maximaal €3.00/m³"),
  stroomPrijs: z
    .number({ message: "Stroomprijs is verplicht" })
    .min(0.1, "Minimaal €0.10/kWh")
    .max(1.0, "Maximaal €1.00/kWh"),
  cop: z.number().min(3).max(5).optional(),
  installatieKosten: z.number().min(0).optional(),
  isolatieCorrectie: z.number().min(0).max(50).optional(),
  subsidieBedrag: z.number().min(0).optional(),
});

export type WarmtepompFormData = z.infer<typeof warmtepompSchema>;
