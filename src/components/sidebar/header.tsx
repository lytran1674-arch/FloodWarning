import { RootState } from '@reduxjs/toolkit/query'
import { FaChevronUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'

type Props={
  title: string
  bgColor?: string
  textColor?:string

}
export const Header = ({title,bgColor,textColor}:Props) => {
  const {user,isAuhenticated}=useSelector((state:RootState)=>state.auth)
  return (
    <div className={`w-full p-2 flex justify-between ${bgColor}`}>
      <p className={`text-xl sm:text-xl lg:text-2xl font-bold m-1 ${textColor}`}>{title}</p>
      <div>
        {isAuhenticated && user &&(
           <p>{user.hoten}</p>
        )}
       
      <FaChevronUp className={`${textColor} text-sm sm:text-xl lg:text-2xl justify-end`} />
      </div>
    </div>
  )
}
