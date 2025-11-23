import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const WarehouseReceiptModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  loading
}) => {

  const [form, setForm] = useState({
    warehouseReceiptDate: "",
    agencyId: "",
    totalAmount: "",
    note: "",
    status: "PENDING_APPROVAL",
    reason: "",
    employeeId: "",
    vehicleIds: []
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        warehouseReceiptDate: initialData.warehouseReceiptDate || "",
        agencyId: initialData.agency?.agencyId || "",
        totalAmount: initialData.totalAmount || "",
        note: initialData.note || "",
        status: initialData.status || "PENDING_APPROVAL",
        reason: initialData.reason || "",
        employeeId: initialData.employee?.employeeId || "",
        vehicleIds: initialData.vehicles?.map(v => v.vehicleId) || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleIdsChange = (e) => {
    const ids = e.target.value
      .split(",")
      .map(id => Number(id.trim()))
      .filter(id => !isNaN(id));

    setForm(prev => ({ ...prev, vehicleIds: ids }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "edit") {
      const payload = {
        status: form.status
      };
      onSubmit(payload);
      return;
    }

    // CREATE
    const payload = {
      ...form,
      warehouseReceiptDate: form.warehouseReceiptDate
        ? new Date(form.warehouseReceiptDate).toISOString()
        : null,
    };
    onSubmit(payload);
  };

  const isEdit = mode === "edit";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />

      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
        <Dialog.Title className="text-xl font-bold mb-4">
          {isEdit ? "Cập nhật phiếu nhập" : "Thêm phiếu nhập"}
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ngày tạo */}
          <div>
            <label className="block mb-1">Ngày tạo phiếu</label>
            <input
              type="date"
              name="warehouseReceiptDate"
              value={
                form.warehouseReceiptDate
                  ? form.warehouseReceiptDate.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={isEdit}
            />
          </div>

          {/* Đại lý */}
          <div>
            <label className="block mb-1">Đại lý</label>
            <input
              type="text"
              name="agencyId"
              value={form.agencyId}
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

          {/* Ghi chú */}
          <div>
            <label className="block mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              disabled={isEdit}
            />
          </div>

          {/* Lý do */}
          <div>
            <label className="block mb-1">Lý do</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required={!isEdit}
              disabled={isEdit}
            />
          </div>

          {/* Nhân viên */}
          <div>
            <label className="block mb-1">ID nhân viên</label>
            <input
              type="number"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              disabled={isEdit}
            />
          </div>

          {/* ID xe */}
          <div>
            <label className="block mb-1">ID xe (cách nhau bằng dấu ,)</label>
            <input
              type="text"
              value={form.vehicleIds.join(",")}
              onChange={handleVehicleIdsChange}
              className="w-full border px-3 py-2 rounded"
              disabled={isEdit}
            />
          </div>

          {/* Status – CHỈ EDIT MỚI CHO SỬA */}
          <div>
            <label className="block mb-1">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              disabled={!isEdit} // chỉ edit mới bật
            >
              <option value="PENDING_APPROVAL">Chờ duyệt</option>
              <option value="CREATED">Đã tạo</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="RECEIVED">Đã nhập kho</option>
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

export default WarehouseReceiptModal;
