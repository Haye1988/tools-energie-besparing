import { z } from "zod";

export const aircoSchema = z.object({
  oppervlakte: z
    .number({ message: "Oppervlakte is verplicht" })
    .min(5, "Minimaal 5 m²")
    .max(500, "Maximaal 500 m²"),
  hoogte: z
    .number({ message: "Plafondhoogte is verplicht" })
    .min(2, "Minimaal 2 m")
    .max(5, "Maximaal 5 m"),
  isolatieNiveau: z.enum(["goed", "gemiddeld", "slecht"], {
    message: "Isolatieniveau is verplicht",
  }),
  toepassing: z.enum(["koelen", "koelen-verwarmen"], {
    message: "Toepassing is verplicht",
  }),
  koelurenPerJaar: z.number().min(0).max(8760).optional(),
  stroomPrijs: z.number().min(0.1).max(1.0).optional(),
  aantalPersonen: z.number().min(1).max(20).optional(),
  raamOppervlak: z.number().min(0).max(100).optional(),
  zonInstraling: z.enum(["geen", "matig", "veel"]).optional(),
  aantalRuimtes: z.number().min(1).max(10).optional(),
});

export type AircoFormData = z.infer<typeof aircoSchema>;
