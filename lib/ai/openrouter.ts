import { ToolName } from "@/types/calculator";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Voorbeeldvragen per tool
export const suggestedQuestions: Record<ToolName, string[]> = {
  zonnepanelen: [
    "Wat is de impact van schaduw op mijn zonnepanelen?",
    "Is een thuisbatterij interessant voor mij?",
    "Hoe werkt de salderingsregeling?",
    "Wat is de terugverdientijd van zonnepanelen?",
  ],
  warmtepomp: [
    "Is mijn huis geschikt voor een warmtepomp?",
    "Wat is het verschil tussen hybride en all-electric?",
    "Welk vermogen heb ik nodig?",
    "Wat zijn de subsidiemogelijkheden?",
  ],
  airco: [
    "Welk koelvermogen heb ik nodig?",
    "Hoe kan ik energiezuinig koelen?",
    "Wat is het verschil tussen split en multi-split?",
    "Hoeveel kost een airco per jaar?",
  ],
  thuisbatterij: [
    "Is een thuisbatterij financieel interessant?",
    "Welke capaciteit heb ik nodig?",
    "Hoe werkt zelfconsumptie?",
    "Wat gebeurt er na afbouw saldering?",
  ],
  isolatie: [
    "Welke isolatiemaatregel heeft de meeste impact?",
    "Wat is de beste volgorde van isoleren?",
    "Zijn er subsidies beschikbaar?",
    "Hoe lang duurt het voordat isolatie zich terugverdient?",
  ],
  "cv-ketel": [
    "Moet ik mijn ketel vervangen?",
    "Wat is het verschil tussen HR-ketel en hybride?",
    "Welk vermogen heb ik nodig?",
    "Wat zijn de kosten van ketelvervanging?",
  ],
  laadpaal: [
    "Welk laadvermogen heb ik nodig?",
    "Kan ik laden met zonnepanelen?",
    "Wat zijn de kosten per laadsessie?",
    "Hoe werkt slim laden?",
  ],
  energiecontract: [
    "Wat is het verschil tussen vast en variabel?",
    "Zijn dynamische contracten interessant?",
    "Wanneer kan ik het beste overstappen?",
    "Wat zijn de risico's van variabele contracten?",
  ],
  kozijnen: [
    "Wat is het verschil tussen HR++ en triple glas?",
    "Hoeveel bespaar ik met nieuwe kozijnen?",
    "Zijn er subsidies beschikbaar?",
    "Wat is de terugverdientijd?",
  ],
  energielabel: [
    "Hoe kan ik mijn energielabel verbeteren?",
    "Welke maatregel heeft de meeste impact?",
    "Wat betekent mijn EPG-waarde?",
    "Hoe wordt het energielabel berekend?",
  ],
  boilers: [
    "Welke boiler is het meest energiezuinig?",
    "Wat is het verschil tussen elektrisch en warmtepompboiler?",
    "Welke capaciteit heb ik nodig?",
    "Hoe werkt legionellapreventie?",
  ],
};

// Tool-specifieke system prompts - uitgebreid met bronvermelding
const toolPrompts: Record<ToolName, string> = {
  zonnepanelen: `Je bent een expert energieadviseur gespecialiseerd in zonnepanelen. 
Geef praktisch, accuraat advies over zonnepanelen opbrengst, saldering, batterij-optie en plaatsing.
Gebruik de berekende resultaten om je advies te onderbouwen. 
Verwijs waar relevant naar betrouwbare bronnen zoals HIER (hier.nu) en Milieu Centraal.
Antwoord altijd in het Nederlands.`,

  warmtepomp: `Je bent een expert energieadviseur gespecialiseerd in warmtepompen. 
Geef advies over hybride vs all-electric warmtepompen, isolatie-vereisten, COP-waarden en dimensionering.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals HIER (hier.nu) en Milieu Centraal.
Antwoord altijd in het Nederlands.`,

  airco: `Je bent een expert energieadviseur gespecialiseerd in airconditioning. 
Geef advies over koelvermogen, energieverbruik, plaatsing en energiezuinig koelen.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals HIER (hier.nu).
Antwoord altijd in het Nederlands.`,

  thuisbatterij: `Je bent een expert energieadviseur gespecialiseerd in thuisbatterijen. 
Geef advies over batterijcapaciteit, zelfconsumptie, saldering afbouw en dynamisch laden.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals HIER (hier.nu) en Milieu Centraal.
Antwoord altijd in het Nederlands.`,

  isolatie: `Je bent een expert energieadviseur gespecialiseerd in isolatie. 
Geef advies over isolatiemaatregelen, prioriteiten, subsidies en terugverdientijd.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals Milieu Centraal voor realistische besparingscijfers.
Antwoord altijd in het Nederlands.`,

  "cv-ketel": `Je bent een expert energieadviseur gespecialiseerd in CV-ketels. 
Geef advies over ketelvervanging, vermogen, tapwater capaciteit en hybride opties.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals Remeha en andere ketelfabrikanten.
Antwoord altijd in het Nederlands.`,

  laadpaal: `Je bent een expert energieadviseur gespecialiseerd in EV-laadpalen. 
Geef advies over laadvermogen, aansluiting, laadtijden en slim laden.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals NextEnergy voor dynamische tarieven.
Antwoord altijd in het Nederlands.`,

  energiecontract: `Je bent een expert energieadviseur gespecialiseerd in energiecontracten. 
Geef advies over vast vs variabel, marktverwachtingen en overstappen.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals NextEnergy voor dynamische contracten.
Antwoord altijd in het Nederlands.`,

  kozijnen: `Je bent een expert energieadviseur gespecialiseerd in kozijnen en glas. 
Geef advies over HR++ vs triple glas, warmteverlies, comfort en terugverdientijd.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals Milieu Centraal voor besparingscijfers.
Antwoord altijd in het Nederlands.`,

  energielabel: `Je bent een expert energieadviseur gespecialiseerd in energielabels. 
Geef advies over EPG-waarden, labelklassen en maatregelen om het label te verbeteren.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar NTA 8800 voor EPC-berekeningen.
Antwoord altijd in het Nederlands.`,

  boilers: `Je bent een expert energieadviseur gespecialiseerd in boilers. 
Geef advies over boiler types, dimensionering, warmtepompboilers en kosten.
Gebruik de berekende resultaten om je advies te onderbouwen.
Verwijs waar relevant naar betrouwbare bronnen zoals Milieu Centraal.
Antwoord altijd in het Nederlands.`,
};

export interface OpenRouterRequest {
  tool: ToolName;
  question: string;
  context: Record<string, any>;
}

export interface OpenRouterResponse {
  answer: string;
  error?: string;
}

export async function getAIResponse(request: OpenRouterRequest): Promise<OpenRouterResponse> {
  const { tool, question, context } = request;

  const apiKey = process.env.OPENROUTER_API_KEY || undefined;
  if (!apiKey) {
    return {
      answer:
        "AI-functie is momenteel niet beschikbaar. Voeg OPENROUTER_API_KEY toe aan environment variables.",
      error: "Missing API key",
    };
  }

  const systemPrompt =
    toolPrompts[tool] || "Je bent een energieadviseur. Antwoord altijd in het Nederlands.";

  // Format context voor de prompt - uitgebreid met meer details
  const contextSummary = formatContextSummary(context);

  const messages = [
    {
      role: "system",
      content: `${systemPrompt}\n\nBelangrijk: Verwijs waar relevant naar betrouwbare bronnen zoals HIER (hier.nu), Milieu Centraal, NextEnergy, of andere erkende energie-adviesorganisaties. Geef altijd praktisch, persoonlijk advies op basis van de specifieke situatie van de gebruiker.`,
    },
    {
      role: "user",
      content: `Context van de berekening en resultaten:\n${contextSummary}\n\nVraag van de gebruiker: ${question}\n\nGeef een duidelijk, praktisch antwoord met waar mogelijk verwijzingen naar betrouwbare bronnen.`,
    },
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "",
        "X-Title": "Energie Besparing Tools",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Goede balans tussen kwaliteit en kosten
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return {
        answer:
          "Sorry, er ging iets mis bij het ophalen van het AI-antwoord. Probeer het later opnieuw.",
        error: `API error: ${response.status}`,
      };
    }

    const data = await response.json();
    
    // Voeg automatisch bronvermelding toe aan antwoord
    let answer = data.choices?.[0]?.message?.content || "Geen antwoord ontvangen.";
    
    // Voeg bronvermelding toe als deze niet al aanwezig is
    if (!answer.includes("HIER") && !answer.includes("Milieu Centraal") && !answer.includes("bron")) {
      answer += "\n\nVoor meer informatie kun je terecht bij HIER (hier.nu) of Milieu Centraal.";
    }

    return { answer };
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    return {
      answer: "Sorry, er ging iets mis. Probeer het later opnieuw.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Formatteer context op een leesbare manier voor AI
function formatContextSummary(context: Record<string, any>): string {
  const parts: string[] = [];
  
  for (const [key, value] of Object.entries(context)) {
    if (value !== null && value !== undefined && value !== "") {
      // Format specifieke velden
      if (typeof value === "object" && !Array.isArray(value)) {
        parts.push(`${key}: ${JSON.stringify(value, null, 2)}`);
      } else {
        parts.push(`${key}: ${value}`);
      }
    }
  }
  
  return parts.join("\n");
}
