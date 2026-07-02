// // src/features/province_operator/components/ProvinceOperatorListPage.tsx
// import {  useState } from "react";
// import {  UploadCloud } from "lucide-react";

// import type { ProvinceOperatorItem } from "../types/provinceType";
// import { ImportProvinceOperatorModal } from "../components/ImportProvinceOperatorModal";


// export function ProvinceOperatorListPage() {
//   const [items, setItems] = useState<ProvinceOperatorItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [importOpen, setImportOpen] = useState(false);

  

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-bold">Điều hành cấp tỉnh</h1>
//         <button
//           onClick={() => setImportOpen(true)}
//           className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg"
//         >
//           <UploadCloud className="w-4 h-4" />
//           Import danh sách
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-sm text-gray-400">Đang tải...</p>
//       ) : (
//         <div className="space-y-2">
//           {items.map((item) => (
//             <div
//               key={item.id}
//               className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
//             >
//               <span className="font-medium text-sm">{item.hoten}</span>
//               <span className="text-xs text-gray-500">
//                 {item.tenkhuvuc_phutrach}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       <ImportProvinceOperatorModal
//         open={importOpen}
//         onClose={() => setImportOpen(false)}
//         onImported={() => {
//           setImportOpen(false);
//           fetchList(); // reload danh sách sau khi import xong
//         }}
//       />
//     </div>
//   );
// }