import { Check } from 'lucide-react';
import type { StepConfig } from './type';

interface StepperHeaderProps {
  steps: StepConfig[];
  currentStep: number;
}

export function StepperHeader({ steps, currentStep }: StepperHeaderProps) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`mt-2 text-xs whitespace-nowrap font-medium transition-colors duration-200 ${
                index < currentStep
                  ? 'text-emerald-600'
                  : index === currentStep
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 mb-5 transition-colors duration-500 ${
                index < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}