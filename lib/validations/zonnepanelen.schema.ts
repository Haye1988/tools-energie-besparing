import { z } from "zod";

export const zonnepanelenSchema = z.object({
  jaarlijksVerbruik: z
    .number({ message: "Jaarlijks verbruik is verplicht" })
    .min(100, "Minimaal 100 kWh")
    .max(50000, "Maximaal 50.000 kWh"),
  dakOrientatie: z.enum(["zuid", "zuidoost", "zuidwest", "oost", "west", "noord"], {
    message: "Dakoriëntatie is verplicht",
  }),
  dakHellingshoek: z
    .number({ message: "Dakhellingshoek is verplicht" })
    .min(0, "Minimaal 0 graden")
    .max(90, "Maximaal 90 graden"),
  dakoppervlak: z.number().min(1).max(1000).optional(),
  paneelVermogen: z
    .number({ message: "Paneelvermogen is verplicht" })
    .min(100, "Minimaal 100 Wp")
    .max(1000, "Maximaal 1000 Wp"),
  stroomPrijs: z
    .number({ message: "Stroomprijs is verplicht" })
    .min(0.1, "Minimaal €0.10/kWh")
    .max(1.0, "Maximaal €1.00/kWh"),
  schaduwPercentage: z.number().min(0).max(50).optional(),
  investeringsKosten: z.number().min(0).optional(),
  salderingActief: z.boolean().optional(),
  terugleverVergoeding: z.number().min(0).max(0.5).optional(),
  thuisbatterij: z.boolean().optional(),
});

export type ZonnepanelenFormData = z.infer<typeof zonnepanelenSchema>;
