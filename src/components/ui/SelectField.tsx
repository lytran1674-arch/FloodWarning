import React from "react";
import type { Option } from "../../features/auth/types/authType";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const SelectField: React.FC<Props> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "-- Chọn --",
  disabled = false,
  required = false,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id}>
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};