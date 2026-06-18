import { useEffect, useState } from "react";
import { rescueApi } from "../api/rescureApi";


export const CreateGroup = () => {


  const [team,setTeam] = useState<any>(null);


  const [groupName,setGroupName] = useState("");
  const [status,setStatus] = useState("AVAILABLE");

  const [hasBoat,setHasBoat] = useState(false);
  const [hasMedical,setHasMedical] = useState(false);

  const [notes,setNotes] = useState("");

  const [loading,setLoading] = useState(false);



  // lấy thông tin team từ login
  useEffect(()=>{

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );


    setTeam(user.team);


  },[]);





  const handleCreateGroup = async()=>{


    if(!groupName.trim()){

      alert("Vui lòng nhập tên nhóm");

      return;
    }



    if(!team?.id){

      alert("Không tìm thấy đội cứu hộ");

      return;
    }



    try{


      setLoading(true);



      const payload = {


        name: groupName,


        // lấy từ local
        teamId: team.id,

        teamName: team.name,


        status,


        hasBoat,


        hasMedical,


        notes

      };



      console.log(
        "Create Group Payload:",
        payload
      );



      const response =
        await rescueApi.CreateGroup(team.id,payload);



      console.log(
        "Create Group Response:",
        response
      );



      alert(
`Tạo nhóm thành công

     ` )



      // reset

      setGroupName("");
      setStatus("AVAILABLE");
      setHasBoat(false);
      setHasMedical(false);
      setNotes("");



    }catch(error){


      console.error(error);

      alert("Có lỗi khi tạo nhóm");


    }finally{


      setLoading(false);

    }


  };





return (

<div className="min-h-screen bg-slate-50 p-6">


<div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">



<h1 className="mb-2 text-2xl font-bold">

Tạo nhóm cứu hộ

</h1>



<div className="mb-5 text-sm text-gray-500">


Đội:

<b>

{" "}

{team?.name || "Đang tải..."}

</b>


</div>





<div className="space-y-4">



<label className="block">

Tên nhóm

</label>


<input

value={groupName}

onChange={
e=>setGroupName(e.target.value)
}

placeholder="Ví dụ: Nhóm Alpha"

className="w-full rounded-lg border p-3"

/>





<label className="block">

Trạng thái

</label>



<select

value={status}

onChange={
e=>setStatus(e.target.value)
}

className="w-full rounded-lg border p-3"

>


<option value="AVAILABLE">

AVAILABLE

</option>


<option value="BUSY">

BUSY

</option>


<option value="MAINTENANCE">

MAINTENANCE

</option>


</select>





<div className="flex gap-6">



<label>

<input

type="checkbox"

checked={hasBoat}

onChange={
e=>setHasBoat(e.target.checked)
}

/>

 Có xuồng

</label>




<label>

<input

type="checkbox"

checked={hasMedical}

onChange={
e=>setHasMedical(e.target.checked)
}

/>

 Có y tế

</label>



</div>





<textarea

rows={4}

value={notes}

onChange={
e=>setNotes(e.target.value)
}

placeholder="Ghi chú"

className="w-full rounded-lg border p-3"

/>





<button


disabled={loading}


onClick={handleCreateGroup}


className="
w-full rounded-lg 
bg-blue-600 p-3 
text-white
"


>


{
loading
?
"Đang tạo..."
:
"Tạo nhóm cứu hộ"
}


</button>




</div>


</div>


</div>

)


};