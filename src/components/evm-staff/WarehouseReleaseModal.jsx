import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const WarehouseReleaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  loading
}) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    releaseDate: "",
    agencyId: "",
    employeeId: "",
    totalAmount: "",
    note: "",
    reason: "",
    status: "PENDING_APPROVAL",
    vehicleIds: []
  });

  // Load data khi edit
  useEffect(() => {
    if (initialData) {
      setForm({
        releaseDate: initialData.releaseDate || "",
        agencyId: initialData.agency?.agencyId || "",
        employeeId: initialData.employee?.employeeId || "",
        totalAmount: initialData.totalAmount || "",
        note: initialData.note || "",
        reason: initialData.reason || "",
        status: initialData.status || "PENDING_APPROVAL",
        vehicleIds: initialData.vehicles?.map(v => v.vehicleId) || []
      });
    }
  }, [initialData]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Vehicle Ids
  const handleVehicleIdsChange = (e) => {
    const ids = e.target.value
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    setForm((prev) => ({ ...prev, vehicleIds: ids }));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🌟 EDIT MODE → chỉ update trạng thái + note + reason
    if (isEdit) {
      const payload = {
        status: form.status,
        note: form.note,
        reason: form.reason,
      };

      onSubmit(payload);
      return;
    }

    // 🌟 CREATE MODE → gửi đủ data
    const payload = {
      releaseDate: form.releaseDate
        ? new Date(form.releaseDate).toISOString()
        : null,
      agencyId: Number(form.agencyId),
      employeeId: Number(form.employeeId),
      totalAmount: Number(form.totalAmount),
      note: form.note || "",
      reason: form.reason || "",
      status: form.status,
      vehicleIds: form.vehicleIds,
    };

    onSubmit(payload);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />

      <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-md">
        <Dialog.Title className="text-xl font-bold mb-4">
          {isEdit ? "Cập nhật phiếu xuất kho" : "Thêm phiếu xuất kho"}
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ngày xuất */}
          <div>
            <label className="block mb-1">Ngày xuất kho</label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate ? form.releaseDate.split("T")[0] : ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={isEdit}
            />
          </div>

          {/* Đại lý */}
          <div>
            <label className="block mb-1">ID Đại lý</label>
            <input
              type="number"
              name="agencyId"
              value={form.agencyId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={isEdit}
            />
          </div>

          {/* Nhân viên */}
          <div>
            <label className="block mb-1">ID Nhân viên</label>
            <input
              type="number"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={isEdit}
            />
          </div>

          {/* Tổng tiền */}
          <div>
            <label className="block mb-1">Tổng tiền</label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={isEdit}
            />
          </div>

          {/* ID xe */}
          <div>
            <label className="block mb-1">ID Xe (ngăn cách bằng dấu ,)</label>
            <input
              type="text"
              value={form.vehicleIds.join(",")}
              onChange={handleVehicleIdsChange}
              className="w-full border px-3 py-2 rounded"
              disabled={isEdit}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1">Lý do</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required={!isEdit}
            />
          </div>

          {/* Status chỉ edit mới cho sửa */}
          <div>
            <label className="block mb-1">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              disabled={!isEdit}
            >
              <option value="PENDING_APPROVAL">Chờ duyệt</option>
              <option value="CREATED">Đã tạo</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="RELEASED">Đã xuất</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100"
              disabled={loading}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {isEdit ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default WarehouseReleaseModal;
