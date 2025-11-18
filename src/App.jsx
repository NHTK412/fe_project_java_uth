import { LanguageProvider } from "./contexts/LanguageContext";
import { LoginPopupProvider } from "./contexts/LoginPopupContext";
import LoginPopup from "./components/shared/LoginPopup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import routes from "./routes/routes";

function App() {
  return (
    <LanguageProvider>
      <LoginPopupProvider>
        <Router>
          <LoginPopup />
          <Routes>
            <Route path="/" element={<Login />} />
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Router>
      </LoginPopupProvider>
    </LanguageProvider>
  );
}

export default App;
