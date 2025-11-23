import { LanguageProvider } from "./contexts/LanguageContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./services/auth/Login";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  );
}

export default App;
