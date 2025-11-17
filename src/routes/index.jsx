import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ImportRequestList from "../pages/admin/ImportRequestList";
import CreateImportRequest from "../pages/admin/CreateImportRequest";
import ImportRequestDetail from "../pages/admin/ImportRequestDetail";
import Dashboard from "../pages/admin/Dashboard";
import UserProfilePage from "../pages/user/UserProfilePage";

/**
 * Router chính của ứng dụng
 * Cấu hình các route cho các trang khác nhau:
 * - Dashboard: Trang chủ
 * - Import Request: Quản lý đơn đặt xe từ hãng
 * - User Profile: Thông tin nhân viên
 */
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* NOTE: Route Dashboard mặc định */}
                <Route
                    path="/"
                    element={
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    }
                />

                {/* NOTE: Route danh sách đơn đặt xe từ hãng */}
                <Route
                    path="/admin/import-request"
                    element={
                        <AdminLayout>
                            <ImportRequestList />
                        </AdminLayout>
                    }
                />

                {/* NOTE: Route chi tiết đơn đặt xe */}
                <Route
                    path="/admin/import-request/:id"
                    element={
                        <AdminLayout>
                            <ImportRequestDetail />
                        </AdminLayout>
                    }
                />

                {/* NOTE: Route tạo đơn đặt xe mới */}
                <Route
                    path="/admin/import-request/create"
                    element={
                        <AdminLayout>
                            <CreateImportRequest />
                        </AdminLayout>
                    }
                />

                {/* NOTE: Route hiển thị thông tin nhân viên */}
                <Route
                    path="/user-profile"
                    element={
                        <AdminLayout>
                            <UserProfilePage />
                        </AdminLayout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
