import type { LucideIcon } from "lucide-react";
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  icon: Icon,
  children,
  className = "",
  ...props
}) => {
  return (
    <label
      {...props}
      className={`flex items-center gap-2 text-sm font-medium text-[#EE0F0F] ${className}`}
    >
      {Icon && <Icon className="lg:size-8" />}
      <span>{children}</span>
    </label>
  );
};