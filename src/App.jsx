// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Layout from "./layouts/Layout";
// // import Login from "./pages/login/Login";

// function App() {
//   const userRole = "admin"; // lấy từ auth, ví dụ: token hoặc state

//   const hasAccess = (role, allowedRoles) => {
//     return allowedRoles.includes(role);
//   };
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Login */}
//         <Route path="/login" element={<Login />} />

//         {/* Admin page */}
//         <Route
//           path="/admin/*"
//           element={
//             hasAccess(userRole, ["admin"]) ? (
//               <Layout />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />

//         {/* EVM + Manager page */}
//         <Route
//           path="/evm/*"
//           element={
//             hasAccess(userRole, ["evm", "manager"]) ? (
//               <Layout />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />

//         {/* Default */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import Layout from "./layouts/Layout";
function App() {
  return (
    <>
      <Layout />
    </>
  );
}
export default App;
