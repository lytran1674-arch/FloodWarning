interface ConditionSelectorProps {
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
  className?: string;
}

export default function ConditionSelector({
  options,
  values,
  onToggle,
  className,
}: ConditionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((item) => (
        <label
          key={item}
          className="
            flex items-center gap-2
            border border-gray-300
            rounded-lg
            px-3 py-2
            cursor-pointer
            hover:bg-gray-100
            transition
          "
        >
          <input
            type="checkbox"
            checked={values.includes(item)}
            onChange={() => onToggle(item)}
            className={`
              w-4 h-4
              accent-blue-600
              cursor-pointer
              
              ${className || ""}
            `}
          />

          <span className="text-sm text-black">
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}