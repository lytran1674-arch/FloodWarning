import { Button } from '@/components/ui/Button'
import React from 'react'

export const Status = () => {
  return (
    <div className='flex justify-start items-center w-auto text-black font-medium gap-3 m-2
    lg:gap-3
    sm:gap-3

    '>
        <Button className='border border-[#E5E7EB] p-2 rounded-md
        lg:p-3 lg:w-[150px] lg;m-3
        sm:p-2 sm:m-3 sm:w-[130px]
        hover:bg-gray-400
        '>Tất cả</Button>
          <Button className='border border-[#E5E7EB] p-2 rounded-md
        lg:p-3 lg:w-[150px] lg;m-3
        sm:p-2 sm:m-3 sm:w-[130px]
        '>Chưa xem</Button>
          <Button className='border border-[#E5E7EB] p-2 rounded-md
        lg:p-3 lg:w-[150px] lg;m-3 
        sm:p-2 sm:m-3 sm:w-[130px]
        '>Đã xem    </Button>
    </div>
  )
}
