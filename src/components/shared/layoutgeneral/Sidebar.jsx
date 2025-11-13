import { ROLES, MENU_GROUPS, getRoleGroup } from "./../../../routes/roles";
import logo from "../../../assets/logo.png";

export default function Sidebar({ role, isOpen, currentPath, onNavigate }) {
  const menuGroupKey = getRoleGroup(role);
  const menus = MENU_GROUPS[menuGroupKey] || [];

  return (
    <aside
      className={`bg-white shadow-md h-screen flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menus.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center ${
                isOpen ? "justify-start gap-3 p-3" : "justify-center p-4"
              } rounded transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
              title={!isOpen ? item.label : ""}
            >
              <span className="text-2xl flex items-center justify-center w-6 h-6">
                {item.icon}
              </span>
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
