// // Button component

// import { useEmergency } from "../hooks/useEmergency";


// export const SosCallButton = () => {
//   const { callSos, loading, error } = useEmergency();

//   return (
//     <div>
//       <button
//         onClick={callSos}
//         disabled={loading}
//         style={{
//           backgroundColor: "#dc2626",
//           color: "white",
//           padding: "16px 32px",
//           borderRadius: "9999px",
//           fontWeight: 700,
//           fontSize: "18px",
//         }}
//       >
//         {loading ? "Đang định vị..." : "🆘 Gọi SOS"}
//       </button>
//       {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
//     </div>
//   );
// };