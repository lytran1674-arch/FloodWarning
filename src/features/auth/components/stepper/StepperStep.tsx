import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { StepConfig } from './type';
import { ValidationRules } from './ValidationRules';

interface StepperStepProps {
  config: StepConfig;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  isLast: boolean;
  isFirst: boolean;
}

export function StepperStep({
  config,
  values,
  onChange,
  onNext,
  onBack,
  isLast,
  isFirst,
}: StepperStepProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (id: string) =>
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  const allRulesPass =
    !config.validationRules ||
    config.validationRules.every((r) => {
      const primaryId = config.fields.find((f) => f.type === 'password')?.id ?? '';
      return r.test(values[primaryId] ?? '', values);
    });

  const allFieldsFilled = config.fields.every((f) => (values[f.id] ?? '').trim() !== '');
  const canProceed = allFieldsFilled && allRulesPass;

  const primaryPasswordField = config.fields.find((f) => f.type === 'password');

  return (
    <div className="space-y-4">
      {config.fields.map((field) => {
        const isPassword = field.type === 'password';
        const shown = showPasswords[field.id];
        const inputType = isPassword ? (shown ? 'text' : 'password') : field.type;

        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}
            </label>
            <div className="relative">
              <input
                id={field.id}
                type={inputType}
                value={values[field.id] ?? ''}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-150"
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => togglePassword(field.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {shown ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {config.validationRules && primaryPasswordField && (
        <ValidationRules
          rules={config.validationRules}
          values={values}
          primaryFieldId={primaryPasswordField.id}
        />
      )}

      <div className={`flex gap-3 pt-2 ${isFirst ? '' : 'flex-row'}`}>
        {!isFirst && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            ← Quay lại
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
            isFirst ? 'w-full' : 'flex-1'
          } ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLast ? 'Hoàn tất' : 'Tiếp tục →'}
        </button>
      </div>
    </div>
  );
}