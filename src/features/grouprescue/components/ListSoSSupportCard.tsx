
import { useSupportRequestListGroup } from "../hooks/useSupportRequestListGroup"
import { useNavigate } from "react-router-dom";

export const ListSoSSupportCard = () => {
  const {sossupport}=useSupportRequestListGroup();
  const navigate=useNavigate()


  return(
      <div className="space-y-4">
          {sossupport.map((sos) => (
            <div
              key={sos.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {sos.groupName}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    👥 {sos.groupLeaderName}
                  </p>

                     <p className="text-sm text-gray-500 mt-1">
                     {sos.reason}
                  </p>
                    
                   
                  <p className="text-sm text-gray-500">
                    📅{" "}
                    {new Date(
                      sos.createdAt
                    ).toLocaleString()}
                  </p>
                  <div className="border bg-blue-100 rounded-lg">
                    <p>{sos.status}</p>
                    </div>
                </div>

              
              </div>
             {(sos.status === "PENDING" || sos.status==="PROCESSING") && (
  <div className="mt-4 flex justify-end">
    <button
      onClick={() => navigate(`/support-group-assign/${sos.id}`)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Phân công
    </button>
  </div>
)}
            </div>
          ))}
        </div>
  )
}
