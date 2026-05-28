import React from 'react'

interface Option{
    label?: string 
    value: string 
}

interface ComboboxProps{
    label?: string 
    option: Option[]
    value:string 
    placeholder?: string 
    onChange: (value:string)=>void | undefined
    className:string 
}
export const Combobox:React.FC<ComboboxProps> = ({
    label,
    option,
    value,
    placeholder="Chọn dữ liệu ",
    onChange,
    className=""
}) => {
  return (
  <div>
    {label && (
        <label className=''>{label}</label>
    )}
    <select value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className}`}
    >
        <option value="">{placeholder}</option>
        {option.map((item)=>(
            <option key={item.value} value={item.value}>
                {item.label}
            </option>
        ))}

        
    </select>
  </div>
  )
}
