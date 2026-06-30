import { ChevronRight, TriangleAlert } from 'lucide-react'

interface AlertCardProps {
  riskLevel: string
  tenkhuvuc: string
  description?: string
  channel: string
  status: string
  time: string
  date: string
}

interface RiskLevelStyle {
  label: string
  bgCard: string
  bgIcon: string
  textTitle: string
  iconColor: string
  borderTag: string
}

const riskLevelConfig: Record<string, RiskLevelStyle> = {
  HIGH: {
    label: 'NGUY HIỂM',
    bgCard: 'bg-red-100',
    bgIcon: 'bg-red-200',
    textTitle: 'text-red-600',
    iconColor: 'text-red-500',
    borderTag: 'border-red-500 bg-red-200 text-red-600',
  },
  MEDIUM: {
    label: 'CẢNH BÁO',
    bgCard: 'bg-orange-100',
    bgIcon: 'bg-orange-200',
    textTitle: 'text-orange-600',
    iconColor: 'text-orange-500',
    borderTag: 'border-orange-500 bg-orange-200 text-orange-600',
  },
  LOW: {
    label: 'AN TOÀN',
    bgCard: 'bg-green-100',
    bgIcon: 'bg-green-200',
    textTitle: 'text-green-600',
    iconColor: 'text-green-500',
    borderTag: 'border-green-500 bg-green-200 text-green-600',
  },
}

export const AlertCard = ({
  riskLevel,
  tenkhuvuc,
  description,
  channel,
  status,
  time,
  date,
}: AlertCardProps) => {
  const config = riskLevelConfig[riskLevel] ?? riskLevelConfig.MEDIUM

  return (
    <div
      className={`flex justify-between items-center border rounded-md p-2 sm:p-3 lg:p-4 m-2 ${config.bgCard}`}
    >
      <div className='flex justify-start gap-3 sm:gap-4 lg:gap-5'>
        <div className={`border p-1.5 rounded-md h-fit ${config.bgIcon}`}>
          <TriangleAlert className={`w-4 h-4 sm:w-5 sm:h-5 ${config.iconColor}`} />
        </div>
        <div className='flex flex-col'>
          <p className={`font-bold text-xs sm:text-sm lg:text-base ${config.textTitle}`}>
            {config.label}
          </p>
          <p className='text-black text-[10px] sm:text-xs lg:text-sm'>{tenkhuvuc}</p>
          {description && (
            <p className='text-black text-[10px] sm:text-xs lg:text-sm'>{description}</p>
          )}
          <div className='flex flex-wrap justify-start gap-2 mt-1'>
            <p className={`border rounded-sm px-1 text-[8px] sm:text-[10px] ${config.borderTag}`}>
              {channel}
            </p>
            <p className='border border-orange-400 rounded-sm px-1 text-[8px] sm:text-[10px] bg-orange-200 text-orange-600'>
              {status}
            </p>
          </div>
        </div>
      </div>
      <div className='flex justify-end items-center gap-2'>
        <div className='flex flex-col items-end'>
          <p className='text-black font-bold text-[10px] sm:text-xs'>{time}</p>
          <p className='text-[10px] sm:text-xs text-gray-500'>{date}</p>
        </div>
        <ChevronRight className='text-black w-4 h-4 sm:w-5 sm:h-5' />
      </div>
    </div>
  )
}