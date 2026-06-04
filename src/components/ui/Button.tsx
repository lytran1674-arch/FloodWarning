interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  imageSrc?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  type = "button",
  imageSrc,
  children,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2 
        ${className}
      `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="button-icon"
          className=" object-contain "
        />
      )}

      {children}
    </button>
  );
};