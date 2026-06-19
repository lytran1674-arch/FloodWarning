// import React, { useState } from 'react';
// import { useGroup } from '../../hooks/useGroup';
// import { MemberRow } from '../member/MemberRow';

// export function UnassignedList() {
//   const { unassigned, groups, assign } = useGroup();
//   const [selections, setSelections] = useState<Record<number, number>>({});

//   if (unassigned.length === 0) {
//     return (
//       <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm">
//         ✓ Tất cả thành viên đã được phân nhóm
//       </div>
//     );
//   }

//   function handleAssign(memberId: number) {
//     const groupId = selections[memberId];
//     if (!groupId) return;
//     assign(memberId, groupId);
//     setSelections(prev => { const n = { ...prev }; delete n[memberId]; return n; });
//   }

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//       {unassigned.map(m => (
//         <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-none">
//           <MemberRow member={m} showRole={false} />
//           <select
//             className="text-sm px-2 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             value={selections[m.id] ?? ''}
//             onChange={e => setSelections(prev => ({ ...prev, [m.id]: Number(e.target.value) }))}
//           >
//             <option value="">Chọn nhóm...</option>
//             {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
//           </select>
//           <button
//             onClick={() => handleAssign(m.id)}
//             disabled={!selections[m.id]}
//             className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
//           >
//             Gán
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
