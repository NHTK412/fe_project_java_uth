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
          {routes.map((route) => {
            if (route.children) {
              // có children routes
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                >
                  {route.children.map((child, index) => (
                    <Route
                      key={child.path || index}
                      index={child.index}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              );
            }
            // không có children routes
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
