import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <>
      <ToastContainer />
      <AdminLayout />
    </>
  );
}

export default App;
