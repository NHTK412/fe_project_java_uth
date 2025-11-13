import { useState } from "react";
import Header from "../components/shared/layoutgeneral/Header";
import Sidebar from "../components/shared/layoutgeneral/Sidebar";
import MainContent from "../components/shared/layoutgeneral/Maincontent";

function Layout({ userInfo }) {
  const [role, setRole] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState("/login");

  const defaultUserInfo = { name: "Admin", email: "Hoàng Gia Bảo" };
  const user = userInfo || defaultUserInfo;

  const handleNavigate = (path) => setCurrentPath(path);
  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-col flex-1 h-full w-full bg-gray-50">
        {/* Header */}
        <Header onToggleSidebar={handleToggleSidebar} userInfo={user} />

        {/* MainContent */}
        <div className="flex-1 overflow-y-auto p-4">
          <MainContent currentPath={currentPath} />
        </div>
      </div>
    </div>
  );
}

export default Layout;
