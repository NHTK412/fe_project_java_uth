import { useEffect, useState } from "react";
import { showSuccess, showError } from "../../shared/toast";
import { vehicleApi } from "../../../services/api/admin/vehicleApi";

export default function VehicleModal({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
  onRefresh,
}) {
  const emptyForm = {
    chassisNumber: "",
    machineNumber: "",
    status: "IN_STOCK",
    vehicleCondition: "",
    vehicleTypeDetailId: 0,
    agencyId: 0,
  };

  const [formData, setFormData] = useState(emptyForm);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData) {
      setFormData({
        chassisNumber: initialData.chassisNumber || "",
        machineNumber: initialData.machineNumber || "",
        status: initialData.status || "IN_STOCK",
        vehicleCondition: initialData.vehicleCondition || "",
        vehicleTypeDetailId: initialData.vehicleTypeDetailId || 0,
        agencyId: initialData.agencyId || 0,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [isOpen, mode, initialData]);

  // Validate form
  const isValid = () =>
    formData.chassisNumber &&
    formData.machineNumber &&
    formData.vehicleCondition &&
    formData.vehicleTypeDetailId &&
    formData.agencyId;

  // Submit
  const handleSubmit = async () => {
    if (!isValid()) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (mode === "create") {
        await vehicleApi.create(formData);
        showSuccess("Thêm xe thành công!");
      } else {
        await vehicleApi.update(initialData.id, formData);
        showSuccess("Cập nhật xe thành công!");
      }

      onRefresh?.();
      onClose();
    } catch (err) {
      console.error(err);
      showError("Có lỗi xảy ra!");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {mode === "create" ? "Thêm Xe Mới" : "Cập Nhật Xe"}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="font-semibold">Số khung</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={formData.chassisNumber}
              onChange={(e) =>
                setFormData({ ...formData, chassisNumber: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Số máy</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={formData.machineNumber}
              onChange={(e) =>
                setFormData({ ...formData, machineNumber: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Tình trạng</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={formData.vehicleCondition}
              onChange={(e) =>
                setFormData({ ...formData, vehicleCondition: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Trạng thái</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="IN_STOCK">TỒN KHO</option>
              <option value="SOLD">ĐÃ BÁN</option>
              <option value="IN_TRANSIT">ĐANG VẬN CHUYỂN</option>
              <option value="TEST_DRIVE">XE LÁI THỬ</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Chi tiết loại xe</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={formData.vehicleTypeDetailId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vehicleTypeDetailId: (e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Đại lý</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={formData.agencyId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  agencyId: (e.target.value),
                })
              }
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-6"
        >
          {mode === "create" ? "Thêm" : "Cập nhật"}
        </button>
      </div>
    </div>
  );
}
