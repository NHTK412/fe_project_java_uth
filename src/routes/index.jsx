import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserProfilePage from "../pages/user/UserProfilePage";

/**
 * Router chính của ứng dụng
 * Cấu hình các route cho các trang khác nhau
 */
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Route Dashboard mặc định */}
                <Route
                    path="/"
                    element={
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    }
                />

                {/* Route hiển thị thông tin nhân viên */}
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
