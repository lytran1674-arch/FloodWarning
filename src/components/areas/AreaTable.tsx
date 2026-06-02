// import type { Area } from "../../features/areas/types/areaType";

// interface Props {
//   data: Area[]
// }

// const AreaTable = ({ data }: Props) => {
//   return (
//     <table className="w-full border">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="p-2 border">Mã</th>
//           <th className="p-2 border">Tên</th>
//           <th className="p-2 border">Vĩ độ</th>
//           <th className="p-2 border">Kinh độ</th>
//         </tr>
//       </thead>

//       <tbody>
//         {data.map((item) => (
//           <tr key={item.id}>
//             <td className="border p-2">
//               {item.id}
//             </td>

//             <td className="border p-2">
//               {item.tenkhuvuc}
//             </td>

//             <td className="border p-2">
//               {item.lat}
//             </td>

//             <td className="border p-2">
//               {item.lon}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }

// export default AreaTable