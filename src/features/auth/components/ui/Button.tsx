import SosImage from "../../../../assets/17d8bcd8-f778-4161-8007-f5649967999a.png"

interface ButtonProps{
  title: string
  onClick?: ()=>void
}

export const Button = ({title, onClick} :ButtonProps) => {
  return (
   <button className="w-60 h-60 absolute left-14 top-1/2 -translate-y-1/2"
   onClick={onClick}>
    <img src={SosImage} alt="Sos"></img>
   </button>
  
  )
}
