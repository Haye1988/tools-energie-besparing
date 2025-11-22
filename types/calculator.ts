// Basis types voor alle calculators

export type ToolName = 
  | "zonnepanelen"
  | "warmtepomp"
  | "airco"
  | "thuisbatterij"
  | "isolatie"
  | "cv-ketel"
  | "laadpaal"
  | "energiecontract"
  | "kozijnen"
  | "energielabel"
  | "boilers";

export interface CalculatorResult {
  tool: ToolName;
  results: Record<string, any>;
  timestamp: Date;
}

export interface LeadData {
  tool: ToolName;
  email: string;
  postcode: string;
  results?: Record<string, any>;
  additionalInfo?: string;
}

export interface AIRequest {
  tool: ToolName;
  question: string;
  context: Record<string, any>;
}

export interface AIResponse {
  answer: string;
  sources?: string[];
}

