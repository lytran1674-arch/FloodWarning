import type { DeviceCounts, TabFilter } from "../../features/iotdevices/types/deviceType";

interface Tab{
    key:TabFilter
    label:string
    countKey?: keyof DeviceCounts
    countClass?: string
}

const TABS: Tab[] = [
  { key: 'all',      label: 'Tất cả',           countKey: 'total',    countClass: 'bg-gray-100 text-gray-500' },
  { key: 'pending',  label: 'Chờ duyệt',        countKey: 'pending',  countClass: 'bg-amber-100 text-amber-700' },
  { key: 'active',   label: 'Đang hoạt động',   countKey: 'active',   countClass: 'bg-green-100 text-green-700' },
  { key: 'rejected', label: 'Từ chối',           countKey: 'rejected', countClass: 'bg-red-100 text-red-700' },
];

interface Props {
  active: TabFilter;
  counts: DeviceCounts;
  onChange: (tab: TabFilter) => void;
}


export function TabBar({ active, counts, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Lọc theo trạng thái"
      className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4"
    >
      {TABS.map(({ key, label, countKey, countClass }) => {
        const isActive = key === active;
        const count = countKey ? counts[countKey] : null;

        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? 'bg-white text-gray-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {label}
            {count !== null && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${countClass}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
