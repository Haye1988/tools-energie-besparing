import { z } from "zod";

export const energiecontractSchema = z.object({
  huidigStroomPrijs: z
    .number({ message: "Huidige stroomprijs is verplicht" })
    .min(0.1, "Minimaal €0.10/kWh")
    .max(1.0, "Maximaal €1.00/kWh"),
  huidigGasPrijs: z
    .number({ message: "Huidige gasprijs is verplicht" })
    .min(0.5, "Minimaal €0.50/m³")
    .max(3.0, "Maximaal €3.00/m³"),
  nieuwStroomPrijs: z
    .number({ message: "Nieuwe stroomprijs is verplicht" })
    .min(0.1, "Minimaal €0.10/kWh")
    .max(1.0, "Maximaal €1.00/kWh"),
  nieuwGasPrijs: z
    .number({ message: "Nieuwe gasprijs is verplicht" })
    .min(0.5, "Minimaal €0.50/m³")
    .max(3.0, "Maximaal €3.00/m³"),
  jaarverbruikStroom: z
    .number({ message: "Jaarverbruik stroom is verplicht" })
    .min(100, "Minimaal 100 kWh")
    .max(50000, "Maximaal 50.000 kWh"),
  jaarverbruikGas: z
    .number({ message: "Jaarverbruik gas is verplicht" })
    .min(100, "Minimaal 100 m³")
    .max(10000, "Maximaal 10.000 m³"),
  contractType: z.enum(["vast", "variabel", "dynamisch"]).optional(),
  vastrechtHuidig: z.number().min(0).max(1000).optional(),
  vastrechtNieuw: z.number().min(0).max(1000).optional(),
  netbeheerderKosten: z.number().min(0).max(1000).optional(),
  groeneStroom: z.boolean().optional(),
  prijsVerwachting: z.enum(["stabiel", "stijgend", "dalend"]).optional(),
});

export type EnergiecontractFormData = z.infer<typeof energiecontractSchema>;
