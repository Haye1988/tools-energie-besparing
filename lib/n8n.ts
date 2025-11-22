import { LeadData } from "@/types/calculator";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export interface N8NResponse {
  success: boolean;
  error?: string;
}

export async function sendLeadToN8N(data: LeadData): Promise<N8NResponse> {
  if (!N8N_WEBHOOK_URL) {
    console.error("N8N_WEBHOOK_URL not configured");
    return {
      success: false,
      error: "N8N webhook URL not configured",
    };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: data.tool,
        email: data.email,
        postcode: data.postcode,
        results: data.results,
        additionalInfo: data.additionalInfo,
        timestamp: new Date().toISOString(),
        source: "energie-besparing-tools",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("N8N webhook error:", errorText);
      return {
        success: false,
        error: `N8N webhook returned ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending to N8N:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

