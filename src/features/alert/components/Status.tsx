import { Button } from '@/components/ui/Button'

type FilterTab = 'ALL' | 'UNREAD' | 'READ'

interface StatusProps {
  active: FilterTab
  onChange: (tab: FilterTab) => void
}

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'UNREAD', label: 'Chưa xem' },
  { key: 'READ', label: 'Đã xem' },
]

export const Status = ({ active, onChange }: StatusProps) => {
  return (
    <div className='flex flex-wrap justify-start items-center gap-2 sm:gap-3 m-2'>
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          onClick={() => onChange(key)}
          className={`border rounded-md p-2 text-xs sm:text-sm lg:p-3 lg:text-base
            w-[100px] sm:w-[130px] lg:w-[150px]
            transition-colors
            ${
              active === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-[#E5E7EB] text-black hover:bg-gray-200'
            }
          `}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}