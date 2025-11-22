import { NextRequest, NextResponse } from "next/server";
import { sendLeadToN8N } from "@/lib/n8n";
import { LeadData } from "@/types/calculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, email, postcode, results, additionalInfo } = body;

    // Validatie
    if (!tool || !email || !postcode) {
      return NextResponse.json(
        { error: "Tool, email en postcode zijn verplicht" },
        { status: 400 }
      );
    }

    // Email validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
    }

    // Postcode validatie (NL formaat: 1234AB)
    const postcodeRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Ongeldige postcode (gebruik formaat: 1234AB)" },
        { status: 400 }
      );
    }

    const leadData: LeadData = {
      tool: tool as LeadData["tool"],
      email: email.trim(),
      postcode: postcode.trim().toUpperCase(),
      results,
      additionalInfo,
    };

    const result = await sendLeadToN8N(leadData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Fout bij verzenden lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in leads API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
