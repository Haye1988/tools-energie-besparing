"use client";

import { cn } from "@/lib/utils";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldRHFProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  options: SelectOption[];
  required?: boolean;
  className?: string;
  defaultValue?: string | number;
}

export default function SelectFieldRHF({
  label,
  name,
  register,
  error,
  options,
  required = false,
  className,
  defaultValue,
}: SelectFieldRHFProps) {
  const errorId = error ? `${name}-error` : undefined;

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
        <select
          id={name}
          {...register}
          required={required}
          defaultValue={defaultValue}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          className={cn(
            "input-focus w-full px-3 py-2.5 md:py-3 bg-white border rounded-input text-totaaladvies-blue outline-none transition-all duration-200 appearance-none cursor-pointer",
            error
              ? "border-red-500 focus:border-red-600 focus:ring-red-500"
              : "border-gray-200 hover:border-totaaladvies-gray-medium",
            'bg-[url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"%3E%3Cpath fill="%23FF7A00" d="M6 9L1 4h10z"/%3E%3C/svg%3E\')] bg-no-repeat bg-[right_0.75rem_center] md:bg-[right_1rem_center] pr-10'
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
