import React from "react";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export const StepProgress = ({
  steps,
  currentStep,
}: StepProgressProps) => {
  return (
    <div className="w-full flex justify-center mb-10">
      <div className="relative flex items-center justify-between w-full max-w-3xl">

        {/* Gray Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 z-0"></div>

        {/* Blue Line */}
        <div
          className="absolute top-5 left-0 h-1 bg-blue-500 z-0 transition-all duration-500"
          style={{
            width: `${
              ((currentStep - 1) / (steps.length - 1)) * 100
            }%`,
          }}
        ></div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const active = currentStep >= stepNumber;

          return (
            <div
              key={step}
              className="flex flex-col items-center z-10"
            >
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  text-white font-bold
                  transition-all duration-300
                  ${
                    active
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }
                `}
              >
                {stepNumber}
              </div>

              {/* Text */}
              <p
                className={`
                  mt-2 text-sm font-medium
                  ${
                    active
                      ? "text-blue-500"
                      : "text-gray-500"
                  }
                `}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};