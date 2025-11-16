import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ImportRequestList from "./pages/admin/ImportRequestList";
import CreateImportRequest from "./pages/admin/CreateImportRequest";
import ImportRequestDetail from "./pages/admin/ImportRequestDetail";

function App() {
  return (
    <>
      <ToastContainer />
      {/* NOTE: Router wrapper để hỗ trợ navigation */}
      <Router>
        <Routes>
          {/* NOTE: Route cho danh sách đơn đặt xe từ hãng */}
          <Route
            path="/admin/import-request"
            element={
              <AdminLayout>
                <ImportRequestList />
              </AdminLayout>
            }
          />
          {/* NOTE: Route cho chi tiết đơn đặt xe */}
          <Route
            path="/admin/import-request/:id"
            element={
              <AdminLayout>
                <ImportRequestDetail />
              </AdminLayout>
            }
          />
          {/* NOTE: Route cho tạo đơn đặt xe mới */}
          <Route
            path="/admin/import-request/create"
            element={
              <AdminLayout>
                <CreateImportRequest />
              </AdminLayout>
            }
          />
          {/* NOTE: Route mặc định - chuyển hướng đến danh sách */}
          <Route
            path="/"
            element={
              <AdminLayout>
                <ImportRequestList />
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
