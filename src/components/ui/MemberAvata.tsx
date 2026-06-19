// import type { Member } from "../../features/rescue/types/rescueType";

// type AvatarColor = "blue" | "teal" | "amber" | "purple";

// const colorMap: Record<AvatarColor, string> = {
//   blue: "bg-blue-100 text-blue-700",
//   teal: "bg-teal-100 text-teal-700",
//   amber: "bg-amber-100 text-amber-700",
//   purple: "bg-purple-100 text-purple-700",
// };

// interface Props {
//   member: Pick<Member, "initials" | "avatarColor">;
//   size?: "sm" | "md" | "lg";
// }

// const sizes = {
//   sm: "w-7 h-7 text-xs",
//   md: "w-9 h-9 text-sm",
//   lg: "w-11 h-11 text-base",
// };

// export function MemberAvatar({
//   member,
//   size = "md",
// }: Props) {
//   const color =
//     colorMap[member.avatarColor as AvatarColor] ??
//     colorMap.blue;

//   return (
//     <div
//       className={`rounded-full flex items-center justify-center font-medium shrink-0 ${sizes[size]} ${color}`}
//     >
//       {member.initials}
//     </div>
//   );
// }