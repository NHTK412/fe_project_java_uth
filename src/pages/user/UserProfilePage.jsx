import UserProfile from "../../components/admin/UserProfile";

/**
 * Page hiển thị thông tin chi tiết của user
 */
const UserProfilePage = () => {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Thông tin nhân viên</h1>
                <p className="text-gray-600 mt-2">Xem và quản lý thông tin cá nhân của bạn</p>
            </div>
            <UserProfile />
        </div>
    );
};

export default UserProfilePage;
