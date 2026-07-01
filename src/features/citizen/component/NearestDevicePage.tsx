// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   MapPin,
//   Radio,
//   Waves,
//   Clock,
//   Navigation
// } from "lucide-react";


// type HistoryItem = {
//   waterLevel:number;
//   recordedAt:string;
// };


// type DeviceHistory = {
//   deviceId:string;
//   deviceName:string;
//   distanceMeters:number;
//   histories:HistoryItem[];
// };



// export const NearestDevicePage =()=>{


// const [data,setData]=useState<DeviceHistory|null>(null);

// const [loading,setLoading]=useState(true);

// const [location,setLocation]=useState({
//  lat:null as number|null,
//  lon:null as number|null
// });





// // lấy GPS người dùng

// useEffect(()=>{


// navigator.geolocation.getCurrentPosition(

// (pos)=>{

// setLocation({

// lat:pos.coords.latitude,
// lon:pos.coords.longitude

// })

// },


// (err)=>{

// console.log(err)

// }

// )


// },[]);






// // gọi API

// useEffect(()=>{


// const fetchData=async()=>{


// if(!location.lat || !location.lon)
// return;



// try{


// const token =
// localStorage.getItem("token");



// const res = await axios.get(

// `https://lapi-lulut.io.vn/iot-device/nearest/history?lat=10.85639&lon=106.76250`,

// {

// headers:{
// Authorization:`Bearer ${token}`
// }

// }

// );



// setData(res.data.result);



// }

// catch(err){

// console.log(err)

// }

// finally{

// setLoading(false)

// }


// }



// fetchData();



// },[location]);






// if(loading)

// return (

// <div className="p-6">
// Đang lấy dữ liệu...
// </div>

// )





// if(!data)

// return (

// <div className="p-6">
// Không tìm thấy thiết bị gần bạn
// </div>

// )





// const current =
// data.histories[0]?.waterLevel ?? 0;


// const max =
// Math.max(
// ...data.histories.map(
// h=>h.waterLevel
// )
// );





// return (

// <div className="
// min-h-screen
// bg-slate-100
// p-4
// md:p-8
// ">


// {/* title */}

// <div className="mb-6">


// <h1 className="
// text-3xl
// font-bold
// text-slate-800
// flex
// gap-2
// items-center
// ">


// <Waves className="text-blue-600"/>

// Giám sát mực nước


// </h1>


// <p className="
// text-gray-500
// ">

// Thiết bị gần vị trí của bạn nhất

// </p>


// </div>







// {/* device card */}

// <div className="
// bg-white
// rounded-2xl
// shadow
// p-5
// ">


// <div className="
// flex
// flex-col
// md:flex-row
// justify-between
// gap-4
// ">



// <div>


// <h2 className="
// text-xl
// font-bold
// flex
// gap-2
// items-center
// ">


// <Radio/>

// {data.deviceName}


// </h2>



// <p className="
// text-gray-500
// mt-2
// flex
// gap-2
// ">

// <MapPin size={18}/>


// Khoảng cách:

// {
// (data.distanceMeters/1000)
// .toFixed(2)
// } km


// </p>



// </div>





// <div className="
// bg-blue-100
// text-blue-700
// px-4
// py-2
// rounded-xl
// flex
// items-center
// gap-2
// ">


// <Navigation size={18}/>

// Đang theo dõi


// </div>


// </div>








// {/* statistic */}

// <div className="
// grid
// grid-cols-1
// sm:grid-cols-3
// gap-4
// mt-6
// ">



// <div className="
// bg-blue-50
// p-5
// rounded-xl
// ">

// <p>
// Mực nước hiện tại
// </p>

// <h2 className="
// text-3xl
// font-bold
// text-blue-600
// ">

// {current.toFixed(2)} m

// </h2>


// </div>





// <div className="
// bg-red-50
// p-5
// rounded-xl
// ">

// <p>
// Cao nhất 1 giờ
// </p>

// <h2 className="
// text-3xl
// font-bold
// text-red-500
// ">

// {max.toFixed(2)} m

// </h2>


// </div>






// <div className="
// bg-gray-50
// p-5
// rounded-xl
// ">

// <p>
// Số lần đo
// </p>


// <h2 className="
// text-3xl
// font-bold
// ">

// {data.histories.length}

// </h2>


// </div>



// </div>









// {/* history */}

// <div className="mt-6">


// <h3 className="
// font-bold
// mb-3
// ">

// Lịch sử đo 1 giờ

// </h3>




// <div className="
// space-y-3
// ">


// {
// data.histories.map((h,i)=>(


// <div
// key={i}
// className="
// bg-slate-50
// rounded-xl
// p-4
// flex
// justify-between
// "
// >


// <div className="
// flex
// gap-2
// items-center
// ">


// <Waves
// size={18}
// className="text-blue-500"
// />


// <b>
// {h.waterLevel.toFixed(2)} m
// </b>


// </div>



// <div className="
// text-gray-500
// flex
// gap-2
// items-center
// ">


// <Clock size={15}/>


// {
// new Date(h.recordedAt)
// .toLocaleTimeString("vi-VN")
// }


// </div>



// </div>


// ))

// }



// </div>



// </div>





// </div>



// </div>


// )

// }

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Radio,
  Waves,
  Clock,
  Navigation
} from "lucide-react";

type HistoryItem = {
  waterLevel: number;
  recordedAt: string;
};

type DeviceHistory = {
  deviceId: string;
  deviceName: string;
  distanceMeters: number;
  histories: HistoryItem[];
};

export const NearestDevicePage = () => {
  const [data, setData] = useState<DeviceHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        "https://api-lulut.io.vn/iot-device/nearest/history?lat=10.85639&lon=106.76250",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data.result);
    } catch (err) {
      console.log("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-gray-500">
        Không tìm thấy thiết bị
      </div>
    );
  }

  const current = data.histories?.[0]?.waterLevel ?? 0;
  const max = Math.max(...(data.histories?.map((x) => x.waterLevel) ?? [0]));

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Waves className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          <span className="text-base sm:text-lg md:text-2xl">Giám sát mực nước</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
          Thiết bị quan trắc gần khu vực người dân
        </p>
      </div>

      {/* Device Card */}
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
        {/* Device info */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
              <Radio className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="text-sm sm:text-base md:text-xl">{data.deviceName}</span>
            </h2>
            <div className="mt-1 sm:mt-2 text-gray-500 flex items-center gap-2 text-xs sm:text-sm md:text-base">
              <MapPin size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span>Khoảng cách:</span>
              <span className="font-semibold">
                {(data.distanceMeters / 1000).toFixed(2)} km
              </span>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-1 sm:gap-2 h-fit text-xs sm:text-sm md:text-base">
            <Navigation size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span>Đang theo dõi</span>
          </div>
        </div>

        {/* Stats - giữ 3 cột trên mọi màn hình, chỉ thu nhỏ */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-5 md:mt-6">
          <div className="bg-blue-50 rounded-xl p-2 sm:p-3 md:p-4">
            <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">Mực nước hiện tại</p>
            <p className="text-base sm:text-lg md:text-3xl font-bold text-blue-600">
              {current.toFixed(2)} m
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-2 sm:p-3 md:p-4">
            <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">Cao nhất 1 giờ</p>
            <p className="text-base sm:text-lg md:text-3xl font-bold text-red-500">
              {max.toFixed(2)} m
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 sm:p-3 md:p-4">
            <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">Số lần đo</p>
            <p className="text-base sm:text-lg md:text-3xl font-bold">
              {data.histories.length}
            </p>
          </div>
        </div>

        {/* History */}
        <div className="mt-4 sm:mt-5 md:mt-6">
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 flex items-center gap-2">
            <Clock size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span>Lịch sử mực nước 1 giờ</span>
          </h3>
          <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[300px] md:max-h-[350px] overflow-y-auto pr-1">
            {data.histories.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2"
              >
                <div className="flex items-center gap-2">
                  <Waves size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500" />
                  <span className="font-bold text-xs sm:text-sm md:text-base">
                    {item.waterLevel.toFixed(2)} m
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-[10px] sm:text-xs md:text-sm">
                  <Clock size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                  {new Date(item.recordedAt).toLocaleString("vi-VN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};