import { useState } from 'react';
import React from 'react';
import { Step } from './Step';
import type { StepperConfig, StepProps, FieldProps } from './type';
import { StepperHeader } from './StepHeader';
import { StepperStep } from './StepperStep';
import { StepperSuccess } from './StepperSucess.tsx';

interface StepperProps {
  children: React.ReactNode;
  title?: string;
  successMessage?: string;
  onComplete?: (values: Record<string, string>) => void;
}

export function Stepper({ children, title, successMessage, onComplete }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  // Build config từ children <Step> và <Field>
  const config: StepperConfig = {
    steps: React.Children.toArray(children)
      .filter((child): child is React.ReactElement<StepProps> =>
        React.isValidElement(child) && child.type === Step
      )
      .map((stepEl) => {
        const fields = React.Children.toArray(stepEl.props.children)
          .filter(React.isValidElement)
          .map((fieldEl) => (fieldEl as React.ReactElement<FieldProps>).props);

        return {
          title: stepEl.props.title,
          fields,
          validationRules: stepEl.props.validationRules,
        };
      }),
    onComplete,
  };

  const handleChange = (id: string, value: string) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  const handleNext = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setDone(true);
      config.onComplete?.(values);
    }
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  const handleReset = () => {
    setCurrentStep(0);
    setValues({});
    setDone(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full max-w-md">
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={handleBack}
            className={`text-gray-400 hover:text-gray-600 transition-colors ${
              currentStep === 0 || done ? 'invisible' : ''
            }`}
            aria-label="Quay lại"
          >
            ←
          </button>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      <StepperHeader
        steps={config.steps}
        currentStep={done ? config.steps.length : currentStep}
      />

      {done ? (
        <StepperSuccess onReset={handleReset} message={successMessage} />
      ) : (
        <StepperStep
          config={config.steps[currentStep]}
          values={values}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          isLast={currentStep === config.steps.length - 1}
          isFirst={currentStep === 0}
        />
      )}
    </div>
  );
}