import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { vehicleTypeDetailApi } from "../../../services/api/admin/vehicleTypeDetailApi";
import { vehicleTypeApi } from "../../../services/api/admin/vehicleTypeApi";
import { showError, showSuccess } from "../../shared/toast";

export default function VehicleTypeDetailModal({ isOpen, onClose, mode = "create", initialData = null, onRefresh }) {
  const [formData, setFormData] = useState({
    vehicleImage: "",
    configuration: "",
    color: "",
    version: "",
    features: "",
    price: "",
    vehicleTypeId: "",
  });
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  // Load danh sách vehicle type để select
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const res = await vehicleTypeApi.getAll(0, 100); // lấy 100 loại xe
        if (res.success) setVehicleTypes(res.data.content || []);
        else showError(res.message || "Lỗi tải loại xe");
      } catch (err) {
        showError(err.message);
      }
    };
    fetchVehicleTypes();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleImage: initialData.vehicleImage || "",
        configuration: initialData.configuration || "",
        color: initialData.color || "",
        version: initialData.version || "",
        features: initialData.features || "",
        price: initialData.price || "",
        vehicleTypeId: initialData.vehicleTypeId || "",
      });
    } else {
      setFormData({
        vehicleImage: "",
        configuration: "",
        color: "",
        version: "",
        features: "",
        price: "",
        vehicleTypeId: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === "create") res = await vehicleTypeDetailApi.create(formData);
      else if (mode === "edit" && initialData?.id) res = await vehicleTypeDetailApi.update(initialData.id, formData);

      if (res.success) {
        showSuccess(mode === "create" ? "Thêm mới thành công!" : "Cập nhật thành công!");
        onClose();
        onRefresh();
      } else showError(res.message || "Thao tác thất bại");
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3"><X /></button>
        <Dialog.Title className="text-lg font-bold mb-4">
          {mode === "create" ? "Thêm chi tiết loại xe" : mode === "edit" ? "Sửa chi tiết loại xe" : "Chi tiết loại xe"}
        </Dialog.Title>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Hình ảnh xe</label>
          <input
            name="vehicleImage"
            value={formData.vehicleImage}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Cấu hình</label>
          <input
            name="configuration"
            value={formData.configuration}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Màu sắc</label>
          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Phiên bản</label>
          <input
            name="version"
            value={formData.version}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Tính năng</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Loại xe</label>
          <select
            name="vehicleTypeId"
            value={formData.vehicleTypeId}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          >
            <option value="">Chọn loại xe</option>
            {vehicleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.vehicleTypeName}
              </option>
            ))}
          </select>
        </div>

        {mode !== "view" && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {mode === "create" ? "Thêm mới" : "Cập nhật"}
          </button>
        )}
      </div>
    </Dialog>
  );
}
