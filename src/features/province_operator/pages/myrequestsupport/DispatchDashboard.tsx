// import { Sidebar } from "@/components/Sidebar";
// import { FilterBar } from "@/components/FilterBar";
// import { SosCard } from "@/components/SosCard";
// import { MapPanel } from "@/components/MapPanel";
// import { DetailPanel } from "@/components/DetailPanel";

// export default function DispatchDashboard() {
//   return (
//     <div className="flex h-screen bg-slate-100">

//       <Sidebar />

//       <main className="flex-1 p-5">

//         <h1 className="text-3xl font-bold mb-5">
//           Dashboard Điều phối
//         </h1>

//         <FilterBar />

//         <div className="grid grid-cols-12 gap-5 mt-5">

//           {/* LEFT */}

//           <div className="col-span-5">

//             <div className="space-y-4 overflow-y-auto h-[760px] pr-2">

//               <SosCard />

//               <SosCard />

//               <SosCard />

//               <SosCard />

//             </div>

//           </div>

//           {/* RIGHT */}

//           <div className="col-span-7 space-y-4">

//             <MapPanel />

//             <DetailPanel />

//           </div>

//         </div>

//       </main>

//     </div>
//   );
// }