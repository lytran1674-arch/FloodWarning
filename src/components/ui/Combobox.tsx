import React from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface ComboboxProps {
  label?: string;
  options: Option[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  label,
  options,
  value,
  placeholder = "Chọn dữ liệu",
  onChange,
  className = "",
  labelClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label className={`text-sm font-medium text-black ${labelClassName}`}>
          {label}
        </label>
      )}

      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full
            h-11
            appearance-none
            rounded-md
            border
            border-[#C9B8B8]
            bg-white
            px-3
            pr-10
            text-sm
            text-black
            outline-none
            focus:border-[#20458E]
            ${className}
          `}
        >
          <option value="">{placeholder}</option>

          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-black
          "
        />
      </div>
    </div>
  );
};