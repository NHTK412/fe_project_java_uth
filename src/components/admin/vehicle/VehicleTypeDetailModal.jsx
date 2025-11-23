import React, { useState, useEffect } from "react";
import axios from "axios";
import { showError } from "../../shared/toast";

export default function VehicleTypeDetailModal({ isOpen, onClose, onSubmit, initialData }) {
  const [vehicleImage, setVehicleImage] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [color, setColor] = useState("");
  const [version, setVersion] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState("");

  const [uploading, setUploading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Load initial data
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setVehicleImage(initialData.vehicleImage || "");

      setPreviewURL(
        initialData.vehicleImage
          ? `http://localhost:8080/api/images/${encodeURIComponent(initialData.vehicleImage)}`
          : ""
      );

      setConfiguration(initialData.configuration || "");
      setColor(initialData.color || "");
      setVersion(initialData.version || "");
      setFeatures(initialData.features || "");
      setPrice(initialData.price ?? "");
      setVehicleTypeId(initialData.vehicleType?.vehicleTypeId ?? "");
    } else {
      setVehicleImage("");
      setPreviewURL("");
      setConfiguration("");
      setColor("");
      setVersion("");
      setFeatures("");
      setPrice("");
      setVehicleTypeId("");
    }
  }, [initialData, isOpen]);

  // cleanup preview
  useEffect(() => {
    return () => {
      if (previewURL && previewURL.startsWith("blob:")) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  if (!isOpen) return null;

  // handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempURL = URL.createObjectURL(file);
    setPreviewURL(tempURL);

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/file-upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res.data.success) {
        const fileName = res.data.data.fileName;
        setVehicleImage(fileName);
        setPreviewURL(`http://localhost:8080/api/images/${encodeURIComponent(fileName)}`);
      } else {
        showError(res.data.message || "Upload ảnh thất bại");
      }
    } catch (err) {
      console.error(err);
      showError("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (
      !vehicleImage ||
      !configuration ||
      !color ||
      !version ||
      !features ||
      !price ||
      !vehicleTypeId
    ) {
      showError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    onSubmit({
      vehicleImage,
      configuration,
      color,
      version,
      features,
      price: parseFloat(price),
      vehicleTypeId: parseInt(vehicleTypeId, 10),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Cập nhật thông tin xe" : "Thêm mới xe"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Upload ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh xe</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById("vehicleFileInput").click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                {uploading ? "Đang upload..." : "Chọn ảnh"}
              </button>
              <input
                type="file"
                id="vehicleFileInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewURL && (
                <img
                  src={previewURL}
                  className="w-24 h-24 object-cover rounded-xl border border-gray-300"
                  alt="preview"
                />
              )}
            </div>
          </div>

          {/* Input fields */}
          {[
            { label: "Cấu hình", value: configuration, setValue: setConfiguration },
            { label: "Màu sắc", value: color, setValue: setColor },
            { label: "Phiên bản", value: version, setValue: setVersion },
            { label: "Tính năng", value: features, setValue: setFeatures },
            { label: "Giá", value: price, setValue: setPrice, type: "number" },
            {
              label: "Vehicle Type ID",
              value: vehicleTypeId,
              setValue: setVehicleTypeId,
              type: "number",
            },
          ].map(({ label, value, setValue, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type || "text"}
                value={value ?? ""}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            {initialData ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
