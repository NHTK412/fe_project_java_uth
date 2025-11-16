import UserProfile from "../../components/admin/UserProfile";

/**
 * Page hiển thị thông tin chi tiết của user
 */
const UserProfilePage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Thông tin nhân viên</h1>
            <UserProfile employeeId={3} />
        </div>
    );
};

export default UserProfilePage;
