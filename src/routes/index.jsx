import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ImportRequestList from "../pages/admin/ImportRequestList";
import CreateImportRequest from "../pages/admin/CreateImportRequest";

// NOTE: Cấu hình routes cho ứng dụng
// Bao gồm:
// - /admin/import-request: Danh sách đơn đặt xe từ hãng
// - /admin/import-request/create: Tạo đơn đặt xe mới
// - /admin/import-request/:id: Chi tiết đơn đặt xe (có thể thêm sau)

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* NOTE: Route cho admin layout với import request pages */}
                <Route
                    path="/admin/import-request"
                    element={
                        <AdminLayout>
                            <ImportRequestList />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/import-request/create"
                    element={
                        <AdminLayout>
                            <CreateImportRequest />
                        </AdminLayout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
