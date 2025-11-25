import { z } from "zod";

export const laadpaalSchema = z.object({
  accuCapaciteit: z
    .number({ message: "Accucapaciteit is verplicht" })
    .min(10, "Minimaal 10 kWh")
    .max(200, "Maximaal 200 kWh"),
  gewensteLaadtijd: z
    .number({ message: "Gewenste laadtijd is verplicht" })
    .min(1, "Minimaal 1 uur")
    .max(24, "Maximaal 24 uur"),
  huisaansluiting: z.enum(["1-fase", "3-fase"], {
    message: "Huisaansluiting is verplicht",
  }),
  zonnepanelen: z.boolean().optional(),
  evModel: z.string().optional(),
  netaansluiting: z.enum(["25A", "35A", "onbekend"]).optional(),
  dynamischContract: z.boolean().optional(),
  dagTarief: z.number().min(0.1).max(1.0).optional(),
  nachtTarief: z.number().min(0.1).max(1.0).optional(),
});

export type LaadpaalFormData = z.infer<typeof laadpaalSchema>;
