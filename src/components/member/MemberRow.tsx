// import React from 'react';
// import type { Member } from '../../types';
// import { MemberAvatar } from '../ui/MemberAvatar';

// interface Props {
//   member: Member;
//   showRole?: boolean;
//   action?: React.ReactNode;
// }

// export function MemberRow({ member, showRole = true, action }: Props) {
//   return (
//     <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
//       <MemberAvatar member={member} />
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">{member.name}</p>
//         {showRole && member.role === 'leader' && (
//           <p className="text-xs text-blue-600">Trưởng nhóm</p>
//         )}
//       </div>
//       {action}
//     </div>
//   );
// }
