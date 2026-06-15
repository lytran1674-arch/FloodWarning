// import { ArrowRight, CloudRain, Droplets, Gauge, Thermometer, WavesHorizontal } from 'lucide-react'
// import { Button } from '../../../components/ui/Button'

// import GeoMap from '../../map/components/GeoMap'
// import { useMemo, useState } from 'react'
// import { Icon } from '@iconify/react';
// import { useAreaPolygon } from '../../map/hooks/usePolygon'
// import { useArea } from '../../areas/hooks/useArea'
// import { useAreaOptions } from '../../areas/hooks/useAreaOption'
// import { HuongDan } from './HuongDan'

// export const WeatherandMap = () => {
//   const areaOption = useAreaOptions()
//   const { areas } = useArea()
//   const [areaId, setAreaId] = useState("")
//   const { polygon } = useAreaPolygon(areaId)

//   const handleChange = (value: string) => {
//     setAreaId(value)
//   }

//   const selectedArea = useMemo(() => {
//     if (!areaId || !areas) return null;
//     const flatAreas = areas.flatMap((area) => area.children || []);
//     return flatAreas.find((child) => child.id === areaId) || null;
//   }, [areaId, areas]);

//   return (
//     <>
//       <div className="flex flex-col lg:flex-row gap-2 p-1 m-1 sm:p-3 text-black">

//         {/* ── LEFT COLUMN (desktop only) ── */}
//         <div className="hidden lg:flex flex-col gap-2 w-[200px] xl:w-[220px] shrink-0">

//           {/* Real-time data */}
//           <div className="border rounded-md p-2 sm:p-3">
//             <div className="flex justify-between items-start gap-2">
//               <p className="text-[8px] lg:text-[14px] sm:text-[10px] font-bold">
//                 DỮ LIỆU THỜI GIAN THỰC <br />
//                 Cập nhật lúc:
//               </p>
//             </div>
//             <div className="flex justify-between mt-1 sm:mt-2 ">
//               <div className="flex items-center gap-1">
//                 <CloudRain stroke="#1160FD" size={14} />
//                 <p className="text-xs sm:text-sm">Lượng mưa</p>
//               </div>
//               <p className="text-xs sm:text-sm">30mm</p>
//             </div>
//             <div className="flex justify-between mt-0.5 sm:mt-1">
//               <div className="flex items-center gap-1">
//                 <WavesHorizontal stroke="#2859C5" size={14} />
//                 <p className="text-xs sm:text-sm">Mực nước</p>
//               </div>
//               <p className="text-xs sm:text-sm">30mm</p>
//             </div>
//             <div className="flex justify-between mt-0.5 sm:mt-1">
//               <div className="flex items-center gap-1">
//                 <Droplets stroke="#2859C5" size={14} />
//                 <p className="text-xs sm:text-sm">Độ ẩm</p>
//               </div>
//               <p className="text-xs sm:text-sm">30mm</p>
//             </div>
//             <div className="flex justify-between mt-0.5 sm:mt-1">
//               <div className="flex items-center gap-1">
//                 <Thermometer stroke="#EE0F0F" size={14} />
//                 <p className="text-xs sm:text-sm">Nhiệt độ</p>
//               </div>
//               <p className="text-xs sm:text-sm">30mm</p>
//             </div>
//             <div className="flex justify-between mt-0.5 sm:mt-1">
//               <div className="flex items-center gap-1">
//                 <Gauge stroke="#EB31CB" size={14} />
//                 <p className="text-xs sm:text-sm">Áp suất</p>
//               </div>
//               <p className="text-xs sm:text-sm">30mm</p>
//             </div>
//           </div>

//           {/* Assembly points */}
//           <div className="border rounded-md p-2 sm:p-3">
//             <p className="text-[8px] lg:text-[14px] sm:text-[10px] text-black font-bold">DANH SÁCH ĐIỂM TẬP KẾT</p>
//           </div>
//         </div>

//         {/* ── CENTER + RIGHT (mobile: map with overlays / desktop: normal) ── */}
//         <div className="flex flex-col lg:flex-row flex-1 gap-2 min-w-0">

//           {/* Map wrapper — has overlays on mobile */}
//           <div className="relative flex-1 min-w-0">

//             {/* MOBILE ONLY: Danger badge — top-left corner over map */}
//             <div className="lg:hidden absolute top-2 left-2 z-10">
//               <div className="bg-[#EE0F0F] rounded-md flex items-center gap-1.5 px-2 py-1.5 shadow-md">
//                 <Icon icon="fa7-solid:house-flood-water" className="text-white text-base shrink-0" />
//                 <div>
//                   <p className="text-white text-[8px] lg:text-[14px] sm:text-[10px]] font-bold leading-tight">NGUY HIỂM CAO</p>
//                   <p className="text-white text-[8px] lg:text-[14px] sm:text-[10px] leading-tight opacity-90">Nguy cơ ngập lụt rất cao</p>
//                 </div>
//               </div>
//             </div>

//             <GeoMap
//               defaultCenter={
//                 selectedArea && selectedArea.lat != null && selectedArea.lon != null
//                   ? [selectedArea.lat, selectedArea.lon]
//                   : [10.7769, 106.7009]
//               }
//               defaultZoom={selectedArea ? 9 : 6}
//               className="w-full h-[220px] sm:h-[280px] lg:w-[700px] lg:h-[400px] min-h-[300px] rounded-md"
//               selectedGeometry={polygon?.geometry}
//               selectedName={selectedArea?.tenkhuvuc}
//             />
//           </div>

//           {/* MOBILE ONLY: alerts panel — right of map */}
//           <div className="lg:hidden flex flex-col gap-2 w-[140px] xs:w-[160px] shrink-0">
//             {/* Recent alerts */}
//             <div className="border rounded-md p-2 h-full">
//               <div className="flex justify-between items-center mb-1">
//                 <p className="text-[10px] font-bold">CẢNH BÁO</p>
//                 <Button className="text-[#1C5FE5] text-[10px] flex items-center gap-0.5 p-0">
//                   Tất cả <ArrowRight size={10} />
//                 </Button>
//               </div>
//               {/* placeholder slot for alert items */}
//             </div>
//           </div>

//           {/* DESKTOP ONLY: right column */}
//           <div className="hidden lg:flex flex-col gap-2 w-[400px] xl:w-[300px] shrink-0">

//             {/* Risk level */}
//             <div className="border rounded-md">
//               <p className="text-[8px] lg:text-[13px] sm:text-[10px] p-1 font-bold">MỨC ĐỘ NGUY CƠ TẠI KHU VỰC CỦA BẠN</p>
//               <div className="bg-[#EE0F0F] rounded-md m-1 flex items-center gap-2 p-1">
//                 <Icon icon="fa7-solid:house-flood-water" className="lg:text-4xl sm:text-xl text-sm text-white" />
//                 <p className="text-white lg:text-sm text-xs text-[8px] lg:text-[14px] sm:text-[10px]">
//                   NGUY HIỂM CAO<br />
//                   Nguy cơ ngập lụt rất cao
//                 </p>
//               </div>
//               <Button className="text-[#1C5FE5] text-xs flex items-center gap-1 px-2 pb-2">
//                 Xem chi tiết <ArrowRight size={13} />
//               </Button>
//             </div>

//             {/* Recent alerts */}
//             <div className="border rounded-md p-2">
//               <div className="flex justify-between items-center">
//                 <p className="text-xs sm:text-sm font-bold">CẢNH BÁO GẦN ĐÂY</p>
//                 <Button className="text-[#1C5FE5] text-xs flex items-center gap-1">
//                   Xem tất cả <ArrowRight size={12} />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* MOBILE ONLY: data + assembly points — below map row */}
//         <div className="lg:hidden flex flex-col gap-2">
//           <div className="border rounded-md p-2">
//             <p className="text-xs font-bold mb-1">DỮ LIỆU THỜI GIAN THỰC <br /><span className="font-normal">Cập nhật lúc:</span></p>
//             <div className="grid grid-cols-2 gap-x-4 gap-y-1">
//               {[
//                 { icon: <CloudRain stroke="#1160FD" size={12} />, label: 'Lượng mưa', value: '30mm' },
//                 { icon: <WavesHorizontal stroke="#2859C5" size={12} />, label: 'Mực nước', value: '30mm' },
//                 { icon: <Droplets stroke="#2859C5" size={12} />, label: 'Độ ẩm', value: '30mm' },
//                 { icon: <Thermometer stroke="#EE0F0F" size={12} />, label: 'Nhiệt độ', value: '30mm' },
//                 { icon: <Gauge stroke="#EB31CB" size={12} />, label: 'Áp suất', value: '30mm' },
//               ].map(({ icon, label, value }) => (
//                 <div key={label} className="flex justify-between items-center">
//                   <div className="flex items-center gap-1">
//                     {icon}
//                     <p className="text-[11px]">{label}</p>
//                   </div>
//                   <p className="text-[11px]">{value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="border rounded-md p-2">
//             <p className="text-xs font-bold">DANH SÁCH ĐIỂM TẬP KẾT</p>
          
//           </div>
//         </div>

//       </div>

    
//     </>
//   )
// }

import { ArrowRight, CloudRain, Droplets, Gauge, Thermometer, WavesHorizontal } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import GeoMap from '../../map/components/GeoMap';
import { useMemo, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useArea } from '../../areas/hooks/useArea';
import CappedPromise from 'capped-promise';

// Hàm gọi API lấy danh sách dự báo
const fetchPredictions = async () => {
  const response = await fetch('https://api-lulut.io.vn/predict/list');
  if (!response.ok) throw new Error('Failed to fetch predictions');
  return response.json();
};

export const WeatherandMap = () => {
  const { areas } = useArea();
  const [areaId, setAreaId] = useState('');
  const [features, setFeatures] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách dự báo
  useEffect(() => {
    setLoading(true);
    fetchPredictions()
      .then(data => setPredictions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Với mỗi dự báo, lấy polygon (giới hạn 3 request cùng lúc)
  useEffect(() => {
    if (!predictions.length) return;

    const fetchPolygons = async () => {
      const jobs = predictions.map((pred) => async () => {
        try {
          const res = await fetch(`https://api-lulut.io.vn/area/polygon-by-id?id=${pred.area_id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: pred.area_id,
            geometry: data.geometry,
            name: pred.tenKhuVuc,
            riskLevel: pred.lead1,
            probability: pred.lead1Probability,
          };
        } catch (err) {
          console.error(`Failed for ${pred.tenKhuVuc}:`, err);
          return null;
        }
      });

      // Chạy tối đa 3 request đồng thời
      const results = await CappedPromise.all(3, jobs);
      setFeatures(results.filter(f => f && f.geometry));
    };

    fetchPolygons();
  }, [predictions]);

  const selectedArea = useMemo(() => {
    if (!areaId || !areas) return null;
    const flatAreas = areas.flatMap((area) => area.children || []);
    return flatAreas.find((child) => child.id === areaId) || null;
  }, [areaId, areas]);

  const handleChange = (value: string) => setAreaId(value);

  return (
    <div className="flex flex-col lg:flex-row gap-2 p-1 m-1 sm:p-3 text-black">
      {/* LEFT COLUMN (desktop) */}
      <div className="hidden lg:flex flex-col gap-2 w-[200px] xl:w-[220px] shrink-0">
        <div className="border rounded-md p-2 sm:p-3">
          <div className="flex justify-between items-start gap-2">
            <p className="text-[8px] lg:text-[14px] sm:text-[10px] font-bold">
              DỮ LIỆU THỜI GIAN THỰC <br />
              Cập nhật lúc:
            </p>
          </div>
          <div className="flex justify-between mt-1 sm:mt-2">
            <div className="flex items-center gap-1"><CloudRain stroke="#1160FD" size={14} /><p className="text-xs sm:text-sm">Lượng mưa</p></div>
            <p className="text-xs sm:text-sm">30mm</p>
          </div>
          <div className="flex justify-between mt-0.5 sm:mt-1">
            <div className="flex items-center gap-1"><WavesHorizontal stroke="#2859C5" size={14} /><p className="text-xs sm:text-sm">Mực nước</p></div>
            <p className="text-xs sm:text-sm">30mm</p>
          </div>
          <div className="flex justify-between mt-0.5 sm:mt-1">
            <div className="flex items-center gap-1"><Droplets stroke="#2859C5" size={14} /><p className="text-xs sm:text-sm">Độ ẩm</p></div>
            <p className="text-xs sm:text-sm">30mm</p>
          </div>
          <div className="flex justify-between mt-0.5 sm:mt-1">
            <div className="flex items-center gap-1"><Thermometer stroke="#EE0F0F" size={14} /><p className="text-xs sm:text-sm">Nhiệt độ</p></div>
            <p className="text-xs sm:text-sm">30mm</p>
          </div>
          <div className="flex justify-between mt-0.5 sm:mt-1">
            <div className="flex items-center gap-1"><Gauge stroke="#EB31CB" size={14} /><p className="text-xs sm:text-sm">Áp suất</p></div>
            <p className="text-xs sm:text-sm">30mm</p>
          </div>
        </div>
        <div className="border rounded-md p-2 sm:p-3">
          <p className="text-[8px] lg:text-[14px] sm:text-[10px] text-black font-bold">DANH SÁCH ĐIỂM TẬP KẾT</p>
        </div>
      </div>

      {/* CENTER + RIGHT */}
      <div className="flex flex-col lg:flex-row flex-1 gap-2 min-w-0">
        <div className="relative flex-1 min-w-0">
          {/* Mobile danger badge */}
          <div className="lg:hidden absolute top-2 left-2 z-10">
            <div className="bg-[#EE0F0F] rounded-md flex items-center gap-1.5 px-2 py-1.5 shadow-md">
              <Icon icon="fa7-solid:house-flood-water" className="text-white text-base shrink-0" />
              <div>
                <p className="text-white text-[8px] lg:text-[14px] sm:text-[10px] font-bold leading-tight">NGUY HIỂM CAO</p>
                <p className="text-white text-[8px] lg:text-[14px] sm:text-[10px] leading-tight opacity-90">Nguy cơ ngập lụt rất cao</p>
              </div>
            </div>
          </div>

          <GeoMap
            defaultCenter={
              selectedArea && selectedArea.lat != null && selectedArea.lon != null
                ? [selectedArea.lat, selectedArea.lon]
                : [10.7769, 106.7009]
            }
            defaultZoom={selectedArea ? 9 : 6}
            className="w-full h-[220px] sm:h-[280px] lg:w-[700px] lg:h-[400px] min-h-[300px] rounded-md"
            features={features}
          />
        </div>

        {/* Mobile alerts panel */}
        <div className="lg:hidden flex flex-col gap-2 w-[140px] xs:w-[160px] shrink-0">
          <div className="border rounded-md p-2 h-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] font-bold">CẢNH BÁO</p>
              <Button className="text-[#1C5FE5] text-[10px] flex items-center gap-0.5 p-0">Tất cả <ArrowRight size={10} /></Button>
            </div>
            {predictions.slice(0, 3).map(p => (
              <div key={p.area_id} className="text-[9px] border-b pb-1 mb-1">
                <p className="font-semibold">{p.tenKhuVuc}</p>
                <p className={`${p.lead1 === 'HIGH' ? 'text-red-500' : p.lead1 === 'MEDIUM' ? 'text-orange-500' : 'text-blue-500'}`}>
                  {p.lead1} ({(p.lead1Probability * 100).toFixed(0)}%)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop right column */}
        <div className="hidden lg:flex flex-col gap-2 w-[400px] xl:w-[300px] shrink-0">
          <div className="border rounded-md">
            <p className="text-[8px] lg:text-[13px] sm:text-[10px] p-1 font-bold">MỨC ĐỘ NGUY CƠ TẠI KHU VỰC CỦA BẠN</p>
            <div className="bg-[#EE0F0F] rounded-md m-1 flex items-center gap-2 p-1">
              <Icon icon="fa7-solid:house-flood-water" className="lg:text-4xl sm:text-xl text-sm text-white" />
              <p className="text-white lg:text-sm text-xs">NGUY HIỂM CAO<br />Nguy cơ ngập lụt rất cao</p>
            </div>
            <Button className="text-[#1C5FE5] text-xs flex items-center gap-1 px-2 pb-2">Xem chi tiết <ArrowRight size={13} /></Button>
          </div>
          <div className="border rounded-md p-2">
            <div className="flex justify-between items-center">
              <p className="text-xs sm:text-sm font-bold">CẢNH BÁO GẦN ĐÂY</p>
              <Button className="text-[#1C5FE5] text-xs flex items-center gap-1">Xem tất cả <ArrowRight size={12} /></Button>
            </div>
            <div className="mt-2 space-y-1">
              {predictions.slice(0, 5).map(p => (
                <div key={p.area_id} className="text-xs border-b pb-1">
                  <p className="font-semibold">{p.tenKhuVuc}</p>
                  <p className={`${p.lead1 === 'HIGH' ? 'text-red-600' : p.lead1 === 'MEDIUM' ? 'text-orange-500' : 'text-blue-600'}`}>
                    {p.lead1} (xác suất: {(p.lead1Probability * 100).toFixed(1)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile data + assembly points */}
      <div className="lg:hidden flex flex-col gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-bold mb-1">DỮ LIỆU THỜI GIAN THỰC <br /><span className="font-normal">Cập nhật lúc:</span></p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { icon: <CloudRain stroke="#1160FD" size={12} />, label: 'Lượng mưa', value: '30mm' },
              { icon: <WavesHorizontal stroke="#2859C5" size={12} />, label: 'Mực nước', value: '30mm' },
              { icon: <Droplets stroke="#2859C5" size={12} />, label: 'Độ ẩm', value: '30mm' },
              { icon: <Thermometer stroke="#EE0F0F" size={12} />, label: 'Nhiệt độ', value: '30mm' },
              { icon: <Gauge stroke="#EB31CB" size={12} />, label: 'Áp suất', value: '30mm' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <div className="flex items-center gap-1">{icon}<p className="text-[11px]">{label}</p></div>
                <p className="text-[11px]">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-bold">DANH SÁCH ĐIỂM TẬP KẾT</p>
        </div>
      </div>
    </div>
  );
};