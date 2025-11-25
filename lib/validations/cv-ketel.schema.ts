import { z } from "zod";

export const cvKetelSchema = z.object({
  gasVerbruik: z
    .number({ message: "Gasverbruik is verplicht" })
    .min(100, "Minimaal 100 m³/jaar")
    .max(10000, "Maximaal 10.000 m³/jaar"),
  huidigKetelType: z.enum(["oud", "redelijk", "nieuw"], {
    message: "Type huidige ketel is verplicht",
  }),
  aantalPersonen: z
    .number({ message: "Aantal personen is verplicht" })
    .min(1, "Minimaal 1 persoon")
    .max(20, "Maximaal 20 personen"),
  gewenstSysteem: z.enum(["hr-ketel", "hybride"], {
    message: "Gewenst systeem is verplicht",
  }),
  gasPrijs: z.number().min(0.5).max(3.0).optional(),
  stroomPrijs: z.number().min(0.1).max(1.0).optional(),
  ketelLeeftijd: z.number().min(0).max(50).optional(),
  installatieKosten: z.number().min(0).optional(),
});

export type CvKetelFormData = z.infer<typeof cvKetelSchema>;
