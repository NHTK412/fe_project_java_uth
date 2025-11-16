import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ overflow: "hidden" }}>
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 p-8 bg-gray-50" style={{ overflowY: "auto" }}>
          <div className="bg-white rounded-2xl p-8 shadow-sm">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
