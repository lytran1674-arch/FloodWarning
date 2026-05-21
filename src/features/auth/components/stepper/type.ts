export interface ValidationRule {
  label: string;
  test: (value: string, allValues?: Record<string, string>) => boolean;
}

export interface StepField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
}

export interface StepConfig {
  title: string;
  fields: StepField[];
  validationRules?: ValidationRule[];
}

export interface StepperConfig {
  steps: StepConfig[];
  onComplete?: (values: Record<string, string>) => void;
}

export interface StepProps {
  title: string;
  children?: React.ReactNode;
  validationRules?: ValidationRule[];
}

export interface FieldProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
}