import React from "react";

type Props = {
  text: string[];
  bgColor?: string;
  textColor?:string

};

export const Menu = ({ text, bgColor, textColor}: Props) => {
  return (
    <div className={`${bgColor} p-3 w-44 `}>
      <ul className="space-y-6">
        {text.map((item, index) => (
          <li className={`border-b-2 p-2 font-medium ${textColor}`} key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};