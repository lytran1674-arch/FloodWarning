import React, { useState, useRef, useEffect } from "react";
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`} ref={wrapperRef}>
      {label && (
        <label className={`text-sm font-medium text-black ${labelClassName}`}>
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          type="text"
          value={open ? search : selectedLabel}
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          readOnly={false}
          className={`
            w-full
            
            rounded-md
            border
            border-[#E5E7EB]
            bg-white
            px-3
            pr-10
            text-sm
            text-black
            outline-none
            focus:border-[#20458E]
            ${className}
          `}
        />

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

        {open && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-[#C9B8B8] bg-white shadow-md">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy</div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.value}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="cursor-pointer px-3 py-2 text-sm text-black hover:bg-gray-100"
                >
                  {item.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};