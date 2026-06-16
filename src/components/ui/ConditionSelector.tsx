import type { ReactElement } from "react";

interface ConditionSelectorProps {
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
   children?: React.ReactNode;
}

export default function ConditionSelector({
  options,
  values,
  onToggle,
}: ConditionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={values.includes(item)}
            onChange={() => onToggle(item)}
          />

          {item}
        </label>
      ))}
    </div>
  );
}