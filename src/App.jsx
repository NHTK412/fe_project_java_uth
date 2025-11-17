import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./auth/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {routes.map(({ path, element, allowedUsers }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute element={element} allowedUsers={allowedUsers} />
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
