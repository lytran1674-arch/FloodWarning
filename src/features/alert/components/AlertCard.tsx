import { ChevronRight, TriangleAlert } from 'lucide-react'


export const AlertCard = () => {
  return (
    <div className='flex justify-between items-center border rounded-md p-2 bg-red-100 m-2'>
        <div className='flex justify-start gap-5'>
            <div className=' border bg-red-200 '>
            <TriangleAlert className='text-red-500'></TriangleAlert>
            </div>
            <div className='flex-col'>
                <p className='text-red-600 font-bold'>NGUY HIỂM </p>
                <p className='text-black text-[10px]'>Phường Thủ Đức</p>
                <p className='text-black text-[10px]'>Có nguy cơ ngập lụt cao</p>
                <div className='flex justify-start gap-2'>
                    <p className='border border-red-500 rounded-sm px-0.5 text-[8px] bg-red-200 text-red-600'>WEB_PUSH</p>
                    <p className='border border-orange-400 rounded-sm px-0.5 text-[8px] bg-orange-200 text-orange-600'>PENDING</p>
                </div>
            </div>
        </div>
        <div className='flex justify-end gap-2'>
        <div className='flex-col'>
            <p  className='text-black font-bold text-[10px]'>23:58</p>
            <p className='text-[10px]'>30/06/2026</p>
        </div>
        <ChevronRight className='text-balck'/>
        </div>
       

    </div>
  )
}
