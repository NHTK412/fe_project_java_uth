import { useEffect } from "react";
import "./App.css";
import { showError, showSuccess } from "./components/shared/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
    </>
  );
}

export default App;
