import React from "react";

interface InputProps {
  id?: string;
  label?: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = ""
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full mb-2">
      {/* LABEL */}
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 text-[#EE0F0F] ${className}`}
      >
        {label}
      </label>

      {/* INPUT */}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        required={required}
        disabled={disabled}
        maxLength={30}
        className={`
          w-full
          p-3
          border
          border-gray-300
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-transparent
          transition-all
          disabled:bg-gray-100
        ${className}`}
      />
    </div>
  );
};
