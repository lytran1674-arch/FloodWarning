import { useSoS } from '@/features/sosrequest/hooks/useSoS';
import { useAppSelector } from '@/hooks/redux.hooks';


export const StatusSoS = () => {
  
  const {request}=useSoS();
    const user = useAppSelector((state) => state.auth.user);
    const isLeaderTeam = user?.isTeamLeader===true

  const criticalSOS = request.filter(
    item => item.priority === "CRITICAL"
  ).length;


  const highsos = request.filter(
    item => item.priority === "HIGH"
  ).length;


  const mediumsos = request.filter(
    item => item.priority === "MEDIUM"
  ).length;


  const lowsos = request.filter(
    item => item.priority === "LOW"
  ).length;


  if(isLeaderTeam){

  return (

    <div className="
      grid
      grid-cols-2
      gap-4
      w-full
    ">


      <div className="
        border
        rounded-md
        p-4
        shadow-sm
        bg-red-50
      ">

        <p className="text-2xl font-bold text-red-600">
          {criticalSOS}
        </p>

        <p className="text-sm">
          Khẩn cấp
        </p>

      </div>





      <div className="
        border
        rounded-md
        p-4
        shadow-sm
        bg-orange-50
      ">

        <p className="text-2xl font-bold text-orange-600">
          {highsos}
        </p>

        <p className="text-sm">
          Mức cao
        </p>

      </div>





      <div className="
        border
        rounded-md
        p-4
        shadow-sm
        bg-yellow-50
      ">

        <p className="text-2xl font-bold text-yellow-600">
          {mediumsos}
        </p>

        <p className="text-sm">
          Trung bình
        </p>

      </div>





      <div className="
        border
        rounded-md
        p-4
        shadow-sm
        bg-green-50
      ">

        <p className="text-2xl font-bold text-green-600">
          {lowsos}
        </p>

        <p className="text-sm">
          Thấp
        </p>

      </div>



    </div>

  )
}
}