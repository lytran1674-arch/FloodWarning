import React from 'react'

interface InputProps{
    label: string
    type?: 'text' | 'password'| 'email' | 'number'
    placeholder?: string
    value: string
    onChange: (value:string)=>void

}

export const Input = ({label,type,placeholder,value,onChange}: InputProps) => {
  return (
    <div className='flex flex-col gap-1.5 w-full'>
        <label className='text-sm font-medium text-red-700 pl-1'>{label}</label>
        <input type={type} value={value}  onChange={(e)=> onChange(e.target.value)}
        required
        maxLength={30}
        disabled={false}
        className='border rounded-sm'/>
    </div>
  )
}
