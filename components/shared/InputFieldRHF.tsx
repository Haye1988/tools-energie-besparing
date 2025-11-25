"use client";

import { cn } from "@/lib/utils";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface InputFieldRHFProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "tel";
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  defaultValue?: string | number;
}

export default function InputFieldRHF({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
  min,
  max,
  step,
  unit,
  required = false,
  className,
  helpText,
  defaultValue,
}: InputFieldRHFProps) {
  const helpTextId = helpText ? `${name}-help` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const ariaDescribedBy = [helpTextId, errorId].filter(Boolean).join(" ") || undefined;

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
          {...register}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          defaultValue={defaultValue}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? "true" : "false"}
          aria-required={required}
          className={cn(
            "input-focus w-full px-4 py-3.5 bg-white border rounded-input text-totaaladvies-blue placeholder:text-gray-400 outline-none transition-all duration-200",
            error
              ? "border-red-500 focus:border-red-600 focus:ring-red-500"
              : "border-gray-200 hover:border-totaaladvies-gray-medium"
          )}
        />
        {unit && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-totaaladvies-gray-medium text-sm pointer-events-none"
            aria-hidden="true"
          >
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600" role="alert">
          {error.message}
        </p>
      )}
      {helpText && !error && (
        <p id={helpTextId} className="text-xs text-totaaladvies-gray-medium" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
