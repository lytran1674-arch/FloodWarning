interface CheckBoxProps{
    options:{
        label:string
        value:string
    }[],
    values:string[];
    onChange:(values:string[])=>void
}

export const CheckBox = ({options,values,onChange}:CheckBoxProps) => {
     const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v:string) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };
  return (
    <div>
      {options.map((item) => (
        <label key={item.value}>
          <input
            type="checkbox"
            checked={values.includes(item.value)}
            onChange={() => toggle(item.value)}
          />
          {item.label}
        </label>
      ))}
    </div>
  )
}
