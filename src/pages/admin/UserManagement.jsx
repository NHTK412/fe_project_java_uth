import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Building2 } from "lucide-react";
import UserTable from "../../components/admin/UserTable";
import UserModal from "../../components/admin/UserModal";
import UserFilters from "../../components/admin/UserFilter";
import { employeeApi, customerApi } from "../../services/api/admin/userApi";
import {
  showSuccess,
  showError,
  showInfo,
} from "../../components/shared/toast";

const TABS = [
  { id: "employee", label: "Nhân viên", icon: Users },
  { id: "customer", label: "Khách hàng", icon: Building2 },
];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("employee");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState("employeeId");
  const [sortDir, setSortDir] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    item: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const api = activeTab === "employee" ? employeeApi : customerApi;
      const sort =
        activeTab === "employee"
          ? sortBy
          : sortBy.replace("employee", "customer");
      const response = await api.getAll(
        pagination.page,
        pagination.size,
        sort,
        sortDir
      );

      if (response.success) {
        const pageData = response.data;
        setData(pageData.content || []);
        setPagination((prev) => ({
          ...prev,
          totalElements: pageData.totalElements || 0,
          totalPages: pageData.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showError("Not able to fetch data");
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.size, sortBy, sortDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 0 }));
    setSortBy(activeTab === "employee" ? "employeeId" : "customerId");
  }, [activeTab]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleView = (item) => {
    setModalMode("view");
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteConfirm({ open: true, item });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.item) return;

    setLoading(true);
    try {
      const api = activeTab === "employee" ? employeeApi : customerApi;
      const id = deleteConfirm.item.employeeId || deleteConfirm.item.customerId;
      const response = await api.delete(id);

      if (response.success) {
        showSuccess("Delete successfully!");
        fetchData();
      } else {
        showError(response.message || "Delete not successful");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError("An error occurred. Please try again later");
    } finally {
      setLoading(false);
      setDeleteConfirm({ open: false, item: null });
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const api = activeTab === "employee" ? employeeApi : customerApi;
      let response;

      if (modalMode === "create") {
        const createData =
          activeTab === "employee"
            ? {
                username: formData.employeeName
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
                employeeName: formData.employeeName,
                gender: formData.gender || null,
                birthDate: formData.birthDate || null,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: formData.address || null,
                role: formData.role,
                agencyId: formData.agencyId || null,
              }
            : {
                customerName: formData.customerName,
                gender: formData.gender || null,
                birthDate: formData.birthDate || null,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: formData.address || null,
                membershipLevel: formData.membershipLevel || "BRONZE",
              };
        response = await api.create(createData);
      } else {
        const id = selectedItem.employeeId || selectedItem.customerId;
        const updateData =
          activeTab === "employee"
            ? {
                username:
                  selectedItem.username ||
                  formData.employeeName?.toLowerCase().replace(/\s+/g, ""),
                employeeName: formData.employeeName,
                gender: formData.gender || selectedItem.gender || null,
                birthDate: formData.birthDate || selectedItem.birthDate || null,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: formData.address || selectedItem.address || null,
                role: formData.role,
                agencyId: formData.agencyId || null,
              }
            : {
                customerName: formData.customerName,
                gender: formData.gender || selectedItem.gender || null,
                birthDate: formData.birthDate || selectedItem.birthDate || null,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: formData.address || selectedItem.address || null,
                membershipLevel: formData.membershipLevel,
              };
        response = await api.update(id, updateData);
      }

      if (response.success) {
        showSuccess(
          modalMode === "create"
            ? "Add new successfully!"
            : "Update successfully!"
        );
        setModalOpen(false);
        fetchData();
      } else {
        const errorMsg =
          typeof response.data === "object"
            ? Object.values(response.data).join(", ")
            : response.message;
        showError(errorMsg || "Operation failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showError("An error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Tạm thời chưa xuất - nào xuất xóa
  // const handleExport = () => {
  //   showInfo("Đang xuất file CSV...");
  // };

  const handleExport = () => {
    if (!data || data.length === 0) {
      showInfo("No data to export");
      return;
    }

    const headers =
      activeTab === "employee"
        ? [
            "ID",
            "Tên nhân viên",
            "Giới tính",
            "Ngày sinh",
            "Số điện thoại",
            "Email",
            "Địa chỉ",
            "Vai trò",
            "Agency ID",
          ]
        : [
            "ID",
            "Tên khách hàng",
            "Giới tính",
            "Ngày sinh",
            "Số điện thoại",
            "Email",
            "Địa chỉ",
            "Hạng thành viên",
          ];

    const rows = filteredData.map((item) => {
      if (activeTab === "employee") {
        return [
          item.employeeId,
          item.employeeName,
          item.gender,
          item.birthDate,
          item.phoneNumber,
          item.email,
          item.address,
          item.role,
          item.agencyId,
        ];
      } else {
        return [
          item.customerId,
          item.customerName,
          item.gender,
          item.birthDate,
          item.phoneNumber,
          item.email,
          item.address,
          item.membershipLevel,
        ];
      }
    });

    let csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      activeTab === "employee" ? "employees.csv" : "customers.csv"
    );
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);

    showSuccess("Export CSV successfully");
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const name = (item.employeeName || item.customerName || "").toLowerCase();
    const email = (item.email || "").toLowerCase();
    const phone = (item.phone || item.phoneNumber || "").toLowerCase();
    return (
      name.includes(search) || email.includes(search) || phone.includes(search)
    );
  });

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-500" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý thông tin nhân viên và khách hàng trong hệ thống
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span className="font-medium">Thêm mới</span>
        </button>
      </div>

      {/* */}
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onRefresh={fetchData}
        onExport={handleExport}
        type={activeTab}
      />

      <UserTable
        data={filteredData}
        type={activeTab}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        type={activeTab}
        mode={modalMode}
        initialData={selectedItem}
        loading={submitLoading}
      />

      {deleteConfirm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setDeleteConfirm({ open: false, item: null })}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa{" "}
              <strong>
                {deleteConfirm.item?.employeeName ||
                  deleteConfirm.item?.customerName}
              </strong>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ open: false, item: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
