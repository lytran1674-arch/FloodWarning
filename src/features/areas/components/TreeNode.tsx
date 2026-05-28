import { useState } from "react"
import type { Area } from "../types/areaType"
import { areaService } from "../services/areaService"

interface Props {
  area: Area
  level?: number
  onSelect?: (area: Area) => void  // ✅ callback khi chọn phường/xã
}

export const TreeNode = ({ area, level = 1, onSelect }: Props) => {
  const [open, setOpen]         = useState(false)
  const [children, setChildren] = useState<Area[]>([])
  const [loading, setLoading]   = useState(false)

  const handleClick = async () => {
    // level 2 → chọn phường/xã, không expand tiếp
    if (level >= 2) {
      onSelect?.(area)
      return
    }

    // Đóng nếu đang mở
    if (open) {
      setOpen(false)
      return
    }

    // Fetch children nếu chưa có
    if (children.length === 0) {
      setLoading(true)
      try {
        const data = await areaService.getFilterChildren(area.id)
        setChildren(data)
      } catch (e) {
        console.error("Lỗi tải phường/xã:", e)
      } finally {
        setLoading(false)
      }
    }

    setOpen(true)
  }

  return (
    <div>
      {/* Row click */}
      <div
        onClick={handleClick}
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded-lg
          cursor-pointer transition-all duration-150 select-none
          ${level === 1
            ? "font-semibold text-sm hover:bg-blue-50 hover:text-blue-700"
            : "text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 ml-4"
          }
        `}
      >

        {level === 1 && (
          <span className="text-[10px] text-slate-400 w-3 flex-shrink-0">
            {loading ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : open ? "▼" : "▶"}
          </span>
        )}

  
        {level === 2 && (
          <span className="text-slate-300 text-xs flex-shrink-0">——›</span>
        )}

        <span className="truncate">{area.tenkhuvuc}</span>
      </div>

      {open && children.length > 0 && (
        <div className="ml-3 border-l border-dashed border-slate-200 pl-2">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              area={child}
              level={2}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Không có phường/xã */}
      {open && !loading && children.length === 0 && (
        <p className="ml-7 text-xs text-slate-300 py-1">Không có dữ liệu</p>
      )}
    </div>
  )
}