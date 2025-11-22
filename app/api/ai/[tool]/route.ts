import { NextRequest, NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai/openrouter";
import { ToolName } from "@/types/calculator";

export async function POST(request: NextRequest, { params }: { params: { tool: string } }) {
  try {
    const tool = params.tool as ToolName;
    const body = await request.json();
    const { question, context } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const response = await getAIResponse({
      tool,
      question,
      context: context || {},
    });

    if (response.error) {
      return NextResponse.json({ answer: response.answer, error: response.error }, { status: 500 });
    }

    return NextResponse.json({ answer: response.answer });
  } catch (error) {
    console.error("Error in AI API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
