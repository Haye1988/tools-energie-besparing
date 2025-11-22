import { ToolName } from "@/types/calculator";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Tool-specifieke system prompts
const toolPrompts: Record<ToolName, string> = {
  zonnepanelen: `Je bent een expert energieadviseur gespecialiseerd in zonnepanelen. 
Geef praktisch, accuraat advies over zonnepanelen opbrengst, saldering, batterij-optie en plaatsing.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  warmtepomp: `Je bent een expert energieadviseur gespecialiseerd in warmtepompen. 
Geef advies over hybride vs all-electric warmtepompen, isolatie-vereisten, COP-waarden en dimensionering.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  airco: `Je bent een expert energieadviseur gespecialiseerd in airconditioning. 
Geef advies over koelvermogen, energieverbruik, plaatsing en energiezuinig koelen.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  thuisbatterij: `Je bent een expert energieadviseur gespecialiseerd in thuisbatterijen. 
Geef advies over batterijcapaciteit, zelfconsumptie, saldering afbouw en dynamisch laden.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  isolatie: `Je bent een expert energieadviseur gespecialiseerd in isolatie. 
Geef advies over isolatiemaatregelen, prioriteiten, subsidies en terugverdientijd.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  "cv-ketel": `Je bent een expert energieadviseur gespecialiseerd in CV-ketels. 
Geef advies over ketelvervanging, vermogen, tapwater capaciteit en hybride opties.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  laadpaal: `Je bent een expert energieadviseur gespecialiseerd in EV-laadpalen. 
Geef advies over laadvermogen, aansluiting, laadtijden en slim laden.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  energiecontract: `Je bent een expert energieadviseur gespecialiseerd in energiecontracten. 
Geef advies over vast vs variabel, marktverwachtingen en overstappen.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  kozijnen: `Je bent een expert energieadviseur gespecialiseerd in kozijnen en glas. 
Geef advies over HR++ vs triple glas, warmteverlies, comfort en terugverdientijd.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  energielabel: `Je bent een expert energieadviseur gespecialiseerd in energielabels. 
Geef advies over EPG-waarden, labelklassen en maatregelen om het label te verbeteren.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,

  boilers: `Je bent een expert energieadviseur gespecialiseerd in boilers. 
Geef advies over boiler types, dimensionering, warmtepompboilers en kosten.
Gebruik de berekende resultaten om je advies te onderbouwen. Antwoord altijd in het Nederlands.`,
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

export async function getAIResponse(
  request: OpenRouterRequest
): Promise<OpenRouterResponse> {
  const { tool, question, context } = request;

  const apiKey = process.env.OPENROUTER_API_KEY || undefined;
  if (!apiKey) {
    return {
      answer: "AI-functie is momenteel niet beschikbaar. Voeg OPENROUTER_API_KEY toe aan environment variables.",
      error: "Missing API key",
    };
  }

  const systemPrompt = toolPrompts[tool] || "Je bent een energieadviseur. Antwoord altijd in het Nederlands.";
  
  // Format context voor de prompt
  const contextText = Object.entries(context)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `Context van de berekening:\n${contextText}\n\nVraag van de gebruiker: ${question}`,
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
        answer: "Sorry, er ging iets mis bij het ophalen van het AI-antwoord. Probeer het later opnieuw.",
        error: `API error: ${response.status}`,
      };
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Geen antwoord ontvangen.";

    return { answer };
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    return {
      answer: "Sorry, er ging iets mis. Probeer het later opnieuw.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

