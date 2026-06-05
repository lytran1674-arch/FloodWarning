import React from 'react'
import { Label } from './Label'
import { MapIcon } from 'lucide-react'
import { Map } from 'leaflet'

export const Form = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
         <h2>CỨU HỘ KHẨN CẤP</h2>
        <form >
           <div>
            <Label icon={MapIcon}>Vị trí</Label>
            
           </div>
        </form>
    </div>
  )
}

