"use client";

import { useState } from "react";
import { ToolName } from "@/types/calculator";

interface AIChatProps {
  tool: ToolName;
  context: Record<string, any>;
  className?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat({ tool, context, className }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/ai/${tool}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          context,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = { role: "assistant", content: data.answer };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, er ging iets mis. Probeer het later opnieuw.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-totaaladvies-orange text-white p-4 rounded-button shadow-button hover:shadow-button-hover transition-all duration-200 z-50 animate-pulse-glow ${className}`}
        aria-label="Open AI assistent"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 bg-white rounded-card shadow-2xl border border-gray-100 flex flex-col max-h-[600px] z-50 animate-scale-in ${className}`}
    >
      <div className="bg-totaaladvies-orange text-white p-4 rounded-t-card flex items-center justify-between">
        <h3 className="font-semibold text-lg">AI Assistent</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          aria-label="Sluit chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-totaaladvies-gray-medium text-sm py-8">
            <p>Stel een vraag over je berekening!</p>
          </div>
        )}
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex animate-fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-input p-3 ${
                message.role === "user"
                  ? "bg-totaaladvies-orange text-white"
                  : "bg-white text-totaaladvies-blue border border-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-input p-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-totaaladvies-orange rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-totaaladvies-orange rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-totaaladvies-orange rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 bg-white rounded-b-card"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stel je vraag..."
            className="input-focus flex-1 px-4 py-3 bg-white border border-gray-200 rounded-input text-totaaladvies-blue placeholder:text-gray-400 outline-none transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-totaaladvies-orange text-white px-4 py-3 rounded-button hover:bg-totaaladvies-orange-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
