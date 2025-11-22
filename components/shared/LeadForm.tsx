"use client";

import { useState } from "react";
import { ToolName } from "@/types/calculator";
import InputField from "./InputField";

interface LeadFormProps {
  tool: ToolName;
  results?: Record<string, any>;
  onSuccess?: () => void;
  className?: string;
}

export default function LeadForm({ tool, results, onSuccess, className }: LeadFormProps) {
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool,
          email,
          postcode,
          results,
          additionalInfo: additionalInfo || undefined,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
        setPostcode("");
        setAdditionalInfo("");
        onSuccess?.();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className={`bg-gradient-card-success border border-success-200 rounded-card p-6 shadow-card animate-scale-in ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-success-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-success-900 text-lg">Bedankt!</h3>
            <p className="text-sm text-success-700 mt-1">
              We nemen zo snel mogelijk contact met je op.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-card border border-gray-100 p-6 lg:p-8 shadow-card">
        <h3 className="text-xl font-bold text-totaaladvies-blue mb-6">
          Ontvang een vrijblijvend advies
        </h3>
        
        <div className="space-y-4">
          <InputField
            label="E-mailadres"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="jouw@email.nl"
            required
          />
          
          <InputField
            label="Postcode"
            name="postcode"
            type="text"
            value={postcode}
            onChange={setPostcode}
            placeholder="1234AB"
            required
          />
          
          <div className="space-y-2">
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-totaaladvies-gray-medium">
              Aanvullende opmerkingen (optioneel)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Vertel ons meer over je situatie..."
              rows={3}
              className="input-focus w-full px-4 py-3.5 bg-white border border-gray-200 rounded-input text-totaaladvies-blue placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-totaaladvies-gray-medium resize-none"
            />
          </div>
          
          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-input p-4 animate-fade-in">
              <p className="text-sm text-red-700">
                Er ging iets mis. Probeer het opnieuw.
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || !email || !postcode}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? "Verzenden..." : "Verstuur aanvraag"}
          </button>
        </div>
      </div>
    </form>
  );
}

