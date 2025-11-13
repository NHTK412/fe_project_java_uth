import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react"; // ✅ thêm ChevronDown

export default function Header({ onToggleSidebar, userInfo }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Ẩn menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-6 relative">
      {/* Bên trái */}
      <div className="flex items-center gap-4 flex-1">
        {/* Nút mở sidebar */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bên phải */}
      <div className="flex items-center gap-4" ref={menuRef}>
        {/* Icon chuông thông báo */}
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-6 h-6 text-gray-700" />
        </button>

        {/* admin + menu */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {userInfo?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-sm text-left">
              <p className="font-semibold">{userInfo?.name || "Admin"}</p>
              <p className="text-gray-500 text-xs">
                {userInfo?.email || "admin@system.com"}
              </p>
            </div>

            {/* icon mũi tên */}
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                showMenu ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => alert("Đăng xuất thành công!")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
