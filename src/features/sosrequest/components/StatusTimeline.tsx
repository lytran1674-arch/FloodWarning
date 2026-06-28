// features/sos/components/StatusTimeline.tsx

import React from "react"

interface Step {
  key: string
  label: string
  description: string
  activeColor: string
  inactiveColor: string
  icon: React.ReactNode
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const AlarmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="13" r="7" /><polyline points="12 10 12 13 14 15" />
    <line x1="7" y1="4" x2="3" y2="8" /><line x1="17" y1="4" x2="21" y2="8" />
  </svg>
)

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
)

const steps: Step[] = [
  {
    key: "pending",
    label: "Pending",
    description: "Đang chờ tiếp nhận",
    activeColor: "bg-green-500",
    inactiveColor: "bg-gray-400",
    icon: <AlarmIcon />,
  },
  {
    key: "processing",
    label: "Processing",
    description: "Đang được xử lý",
    activeColor: "bg-blue-500",
    inactiveColor: "bg-blue-500",
    icon: <DotsIcon />,
  },
  {
    key: "done",
    label: "Done",
    description: "Hoàn thành",
    activeColor: "bg-gray-600",
    inactiveColor: "bg-gray-600",
    icon: <CheckIcon />,
  },
]

interface StatusTimelineProps {
  horizontal?: boolean  // true = nằm ngang (mobile)
}

export const StatusTimeline = ({ horizontal = false }: StatusTimelineProps) => {
  const currentStep = 0 // PENDING is current

  if (horizontal) {
    // ── HORIZONTAL (mobile) ──────────────────────────────────────────
    return (
      <div className="w-full">
        {/* Steps nằm ngang */}
        <div className="flex items-start justify-between gap-1 w-full">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep
            const isLast   = idx === steps.length - 1
            const isPast   = idx < currentStep

            return (
              <React.Fragment key={step.key}>
                {/* Step */}
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  {/* Icon circle */}
                  <div
                    className={`
                      w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0
                      ${isActive ? step.activeColor : step.inactiveColor}
                      ${isActive ? "ring-4 ring-offset-2 ring-green-200" : ""}
                    `}
                  >
                    {step.icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`
                      w-full rounded-xl px-2 py-2 border text-center
                      ${isActive
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`font-semibold text-xs ${
                          isActive ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-[10px] bg-white border border-green-300 text-green-600 rounded-full px-1.5 py-0.5 leading-none">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector giữa các bước */}
                {!isLast && (
                  <div className="flex-shrink-0 mt-5">
                    <div
                      className={`h-0.5 w-6 sm:w-8 ${
                        isPast ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2.5 mt-4">
          <span className="text-blue-500 text-sm mt-0.5">ℹ️</span>
          <p className="text-xs text-blue-700 leading-relaxed">
            Bạn sẽ nhận được thông báo nếu có thông tin mới.
          </p>
        </div>
      </div>
    )
  }

  // ── VERTICAL (desktop) ───────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Trạng thái yêu cầu</h2>

      <div className="flex flex-col flex-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isLast   = idx === steps.length - 1
          const isPast   = idx < currentStep

          return (
            <div key={step.key} className="flex gap-3">
              {/* Icon + connector dọc */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0
                    ${isActive ? step.activeColor : step.inactiveColor}
                    ${isActive ? "ring-4 ring-offset-2 ring-green-200" : ""}
                  `}
                >
                  {step.icon}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 my-1 ${
                      isPast ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ minHeight: 28 }}
                  />
                )}
              </div>

              {/* Card */}
              <div className={`flex-1 ${!isLast ? "pb-4" : ""}`}>
                <div
                  className={`rounded-xl px-3 py-2.5 border ${
                    isActive
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold text-sm ${
                        isActive ? "text-green-600" : "text-gray-700"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="text-xs bg-white border border-green-300 text-green-600 rounded-full px-2 py-0.5">
                        Hiện tại
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2.5 mt-3">
        <span className="text-blue-500 text-sm mt-0.5">ℹ️</span>
        <p className="text-xs text-blue-700 leading-relaxed">
          Bạn sẽ nhận được thông báo nếu có thông tin mới.
        </p>
      </div>
    </div>
  )
}