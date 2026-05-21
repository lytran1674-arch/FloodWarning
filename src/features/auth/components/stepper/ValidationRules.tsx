import { Check } from 'lucide-react';
import type { ValidationRule } from './type';

interface ValidationRulesProps {
  rules: ValidationRule[];
  values: Record<string, string>;
  primaryFieldId: string;
}

export function ValidationRules({ rules, values, primaryFieldId }: ValidationRulesProps) {
  const primaryValue = values[primaryFieldId] ?? '';

  return (
    <ul className="mt-4 space-y-2">
      {rules.map((rule) => {
        const passing = rule.test(primaryValue, values);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-2.5 text-sm transition-colors duration-200 ${
              passing ? 'text-emerald-700' : 'text-gray-500'
            }`}
          >
            <span
              className={`flex-shrink-0 w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-200 ${
                passing
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {passing && <Check size={10} strokeWidth={3} color="white" />}
            </span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}