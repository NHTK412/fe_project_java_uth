import { LanguageProvider } from "./contexts/LanguageContext";
// Removed LoginPopupProvider and LoginPopup
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./services/auth/Login";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// <<<<<<< HEAD
// import AppRouter from "./routes";

// function App() {
//   return (
//     <>
//       <ToastContainer />
//       <AppRouter />
//     </>
// =======

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Router>
    </LanguageProvider>
// >>>>>>> 84c6a234f244f11b330a2ade773d1800d8941b24
  );
}

export default App;
