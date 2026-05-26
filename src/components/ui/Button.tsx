

interface ButtonProps{
 type?: "button" | "submit" | "reset";
  onClick?: () => void;
  imageSrc?: string;         
  children?: React.ReactNode;
  disabled?: boolean
  className?: string

}

export const Button = ({type,imageSrc, children,onClick,disabled=false, className=""} :ButtonProps) => {
  return (
   <button className={className}
   onClick={onClick}
   type={type}
   disabled={disabled}
 

  
   >
   {imageSrc ? (
        <img
          src={imageSrc}
          alt="button-icon"
          className="w-[400px] absolute left-14 top-1/2 -translate-y-1/2"
        />
      ) : (
        <span className="text-lg font-bold ">{children}</span>
      )}
    </button>
  
  )
}
