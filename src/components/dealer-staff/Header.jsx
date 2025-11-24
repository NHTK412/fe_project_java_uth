import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, MessageSquareDot } from "lucide-react";

const AVATAR_GRADIENT = "linear-gradient(135deg, #8b5cf6, #2563eb)";

const ROLE_MAP = {
  ROLE_ADMIN: "Quản trị viên",
  ROLE_DEALER_MANAGER: "Quản lý đại lý",
  ROLE_DEALER_STAFF: "Nhân viên đại lý",
  ROLE_EVM_STAFF: "Nhân viên hãng",
};

const IconButton = ({ icon: Icon, tooltip, badge, ariaLabel }) => (
  <div className="relative group">
    <button
      aria-label={ariaLabel}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Icon className="w-6 h-6 text-gray-700" />
      {badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
      {tooltip}
    </span>
  </div>
);

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-64">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        aria-label="Tìm kiếm"
        className={`w-full py-2 pl-10 pr-4 border rounded-lg outline-none transition-all ${isFocused ? "border-blue-500 ring-4 ring-blue-100" : "border-gray-200"
          }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

const UserAvatar = ({ fullName, position, avatarInitials, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
    aria-label="Xem thông tin cá nhân"
  >
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
      style={{ background: AVATAR_GRADIENT }}
      aria-label={`Avatar của ${fullName}`}
    >
      {avatarInitials}
    </div>
    <div className="text-sm">
      <div className="font-semibold text-gray-900">{fullName}</div>
      <div className="text-gray-500">{position}</div>
    </div>
  </button>
);

const Header = () => {
  const navigate = useNavigate();
  const [userData] = useState({
    fullName: "ADMIN",
    position: "Quản trị viên",
    avatarInitials: "AD",
  });

  // Điều hướng tới trang thông tin cá nhân khi click avatar
  const handleAvatarClick = () => {
    navigate("/user-profile");
  };

  /* 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees/1");
        const data = await response.json();

        const displayPosition = data.position
          ? ROLE_MAP[data.position] || data.position
          : "Quản trị viên";

        const avatarInitials =
          data.employeeName
            ?.split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "AD";

        setUserData({
          fullName: data.employeeName || "Admin",
          position: displayPosition,
          avatarInitials,
        });
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, []);
  */

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between flex-shrink-0">
      <div className="ml-8">
        <SearchInput />
      </div>

      <div className="flex items-center gap-4 mr-8">
        <IconButton
          icon={MessageSquareDot}
          tooltip="Feedbacks"
          ariaLabel="Xem feedback"
        />

        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
          <IconButton
            icon={Bell}
            tooltip="Notifications"
            badge={true}
            ariaLabel="Xem thông báo"
          />
        </div>

        <div className="pl-4 border-l border-gray-200">
          <UserAvatar
            fullName={userData.fullName}
            position={userData.position}
            avatarInitials={userData.avatarInitials}
            onClick={handleAvatarClick}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
