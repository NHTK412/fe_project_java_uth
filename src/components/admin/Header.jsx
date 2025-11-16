import { useState } from "react";
import { Search, Bell, MessageSquareDot } from "lucide-react";

const Header = () => {
  const [userData, setUserData] = useState({
    fullName: "ADMIN",
    position: "Quản trị viên",
    avatarInitials: "AD",
  });
  const [isLoading, setIsLoading] = useState(false); // tạm thời không loading

  /* 
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/employees/1");
        const data = await response.json();

        const roleMap = {
          ADMIN: "Quản trị viên",
          MANAGER: "Quản lý",
          SALES_STAFF: "Nhân viên kinh doanh",
          DELIVERY_STAFF: "Nhân viên giao hàng"
        };
        const displayPosition = data.position
          ? roleMap[data.position] || data.position
          : "Quản trị viên";

        const avatarInitials =
          data.fullName
            ?.split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "AD";

        setUserData({
          fullName: data.fullName || "Admin",
          position: displayPosition,
          avatarInitials,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          fullName: "Admin",
          position: "Quản trị viên",
          avatarInitials: "AD",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  */

  return (
    <header
      className="bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0"
      style={{ height: "4rem" }}
    >
      <div className="relative w-64 ml-8">
        <Search
          className="absolute w-5 h-5 text-gray-400"
          style={{ left: "1rem", top: "50%", transform: "translateY(-50%)" }}
        />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full py-2 border border-gray-200 rounded-lg outline-none transition-all"
          style={{ paddingLeft: "2.5rem", paddingRight: "1rem" }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div className="flex items-center gap-4 ml-8 mr-8">
        <div className="relative group">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageSquareDot className="w-6 h-6 text-gray-700" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            Feedbacks
          </span>
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
          <div className="relative group">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-6 h-6 text-gray-700" />
              <span
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: "0.25rem",
                  right: "0.25rem",
                  backgroundColor: "#ef4444",
                }}
              ></span>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              Notifications
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
          <>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #2563eb)",
              }}
            >
              {userData.avatarInitials}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                {userData.fullName}
              </div>
              <div className="text-gray-500">{userData.position}</div>
            </div>
          </>
        </div>
      </div>
    </header>
  );
};

export default Header;
