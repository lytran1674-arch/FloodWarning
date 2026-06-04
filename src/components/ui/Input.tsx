import type { LucideIcon } from "lucide-react";
import React from "react";

interface InputProps {
  id?: string;
  label?: string;
  type?: "text" | "password" | "email" | "number" | "date";
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  disabled = false,
  className = "",
  containerClassName = "",
}) => {
  return (
    <div
      className={`flex flex-col gap-1.5 w-full min-w-0 ${
        label ? "mb-2" : ""
      } ${containerClassName}`}
    >
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#EE0F0F]">
          {label}
        </label>
      )}

      <div className="relative w-full min-w-0">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        )}

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          disabled={disabled}
          maxLength={30}
          style={{
            colorScheme: "light",
            fontSize: "16px",
          }}
          className={`
            w-full min-w-0 max-w-full p-3
            ${Icon ? "pl-10" : ""}
            bg-white text-black placeholder:text-gray-400
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all disabled:bg-gray-100 disabled:text-gray-500
            ${className}
          `}
        />
      </div>
    </div>
  );
};