"use client";

import { cn } from "@/lib/utils";

interface InputFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "tel";
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  unit,
  required = false,
  className,
  helpText,
}: InputFieldProps) {
  const helpTextId = helpText ? `${name}-help` : undefined;
  const ariaDescribedBy = helpTextId ? helpTextId : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-totaaladvies-gray-medium">
        {label}
        {required && (
          <span className="text-totaaladvies-red ml-1" aria-label="verplicht veld">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(e) => {
            const val = type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
            onChange(val);
          }}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          className="input-focus w-full px-3 py-2.5 md:py-3 bg-white border border-gray-200 rounded-input text-totaaladvies-blue placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-totaaladvies-gray-medium"
        />
        {unit && (
          <span
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-totaaladvies-gray-medium text-sm pointer-events-none"
            aria-hidden="true"
          >
            {unit}
          </span>
        )}
      </div>
      {helpText && (
        <p id={helpTextId} className="text-xs text-totaaladvies-gray-medium" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
