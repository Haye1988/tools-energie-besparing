import { z } from "zod";

export const thuisbatterijSchema = z.object({
  zonnepaneelVermogen: z
    .number({ message: "Zonnepaneel vermogen is verplicht" })
    .min(1, "Minimaal 1 kWp")
    .max(50, "Maximaal 50 kWp"),
  jaarlijksVerbruik: z
    .number({ message: "Jaarlijks verbruik is verplicht" })
    .min(100, "Minimaal 100 kWh")
    .max(50000, "Maximaal 50.000 kWh"),
  jaarlijkseOpwekking: z.number().min(0).max(100000).optional(),
  doel: z.enum(["eigen-verbruik", "backup", "dynamisch"], {
    message: "Doel is verplicht",
  }),
  gewensteAutonomie: z.number().min(1).max(168).optional(),
  salderingActief: z.boolean().optional(),
  stroomPrijs: z.number().min(0.1).max(1.0).optional(),
  terugleverVergoeding: z.number().min(0).max(0.5).optional(),
  investeringsKosten: z.number().min(0).optional(),
});

export type ThuisbatterijFormData = z.infer<typeof thuisbatterijSchema>;
