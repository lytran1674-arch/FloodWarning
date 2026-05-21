import { CheckCircle } from 'lucide-react';

interface StepperSuccessProps {
  onReset: () => void;
  message?: string;
}

export function StepperSuccess({
  onReset,
  message = 'Thao tác đã hoàn thành thành công!',
}: StepperSuccessProps) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <CheckCircle size={32} className="text-emerald-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-1.5">Hoàn tất!</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
      >
        Thử lại từ đầu
      </button>
    </div>
  );
}