import { Icon } from '@iconify/react';
import { Button } from '../../../components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const AreaFlood = () => {
  return (
    <div>
                  {/* DESKTOP ONLY: right column */}
          <div className="hidden lg:flex flex-col gap-2 w-[400px] xl:w-[300px] shrink-0">

            {/* Risk level */}
            <div className="border rounded-md">
              <p className="text-[8px] lg:text-[13px] sm:text-[10px] p-1 font-bold">MỨC ĐỘ NGUY CƠ TẠI KHU VỰC CỦA BẠN</p>
              <div className="bg-[#EE0F0F] rounded-md m-1 flex items-center gap-2 p-1">
                <Icon icon="fa7-solid:house-flood-water" className="lg:text-4xl sm:text-xl text-sm text-white" />
                <p className="text-white lg:text-sm text-xs text-[8px] lg:text-[14px] sm:text-[10px]">
                  NGUY HIỂM CAO<br />
                  Nguy cơ ngập lụt rất cao
                </p>
              </div>
              <Button className="text-[#1C5FE5] text-xs flex items-center gap-1 px-2 pb-2">
                Xem chi tiết <ArrowRight size={13} />
              </Button>
            </div>

            {/* Recent alerts */}
            <div className="border rounded-md p-2">
              <div className="flex justify-between items-center">
                <p className="text-xs sm:text-sm font-bold">CẢNH BÁO GẦN ĐÂY</p>
                <Button className="text-[#1C5FE5] text-xs flex items-center gap-1">
                  Xem tất cả <ArrowRight size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>
  )
}
