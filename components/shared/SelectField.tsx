"use client";

import { cn } from "@/lib/utils";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  required?: boolean;
  className?: string;
}

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-totaaladvies-gray-medium">
        {label}
        {required && <span className="text-totaaladvies-red ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => {
            const val = typeof options[0]?.value === "number" 
              ? parseFloat(e.target.value) || 0 
              : e.target.value;
            onChange(val);
          }}
          required={required}
          className="input-focus w-full px-4 py-3.5 bg-white border border-gray-200 rounded-input text-totaaladvies-blue outline-none transition-all duration-200 hover:border-totaaladvies-gray-medium appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF7A00' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            paddingRight: '2.5rem',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

