import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

// NOTE: Component modal để chọn chi tiết loại xe với các filter (màu sắc, cấu hình, tính năng, phiên bản)
const VehicleDetailSelector = ({ vehicleDetails, onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({
        version: "",
        color: "",
        configuration: "",
    });

    // NOTE: Trích xuất các option duy nhất cho mỗi filter
    const getUniqueValues = (key) => {
        const values = vehicleDetails
            .map((v) => v[key])
            .filter((v) => v && v.trim() !== "");
        return [...new Set(values)].sort();
    };

    // NOTE: Lọc danh sách xe dựa trên tìm kiếm và filters
    const filteredVehicles = vehicleDetails.filter((vehicle) => {
        const matchesSearch =
            vehicle.version?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.configuration?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesVersion =
            !selectedFilters.version || vehicle.version === selectedFilters.version;
        const matchesColor =
            !selectedFilters.color || vehicle.color === selectedFilters.color;
        const matchesConfiguration =
            !selectedFilters.configuration ||
            vehicle.configuration === selectedFilters.configuration;

        return (
            matchesSearch && matchesVersion && matchesColor && matchesConfiguration
        );
    });

    // NOTE: Xử lý chọn xe
    const handleSelectVehicle = (vehicle) => {
        onSelect(vehicle);
        onClose();
    };

    // NOTE: Reset filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedFilters({ version: "", color: "", configuration: "" });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* NOTE: Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Chọn loại xe chi tiết
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* NOTE: Tìm kiếm và filters */}
                <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
                    {/* NOTE: Ô tìm kiếm */}
                    <div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo phiên bản, màu sắc, cấu hình..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* NOTE: Bộ lọc */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* NOTE: Filter phiên bản */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phiên bản
                            </label>
                            <select
                                value={selectedFilters.version}
                                onChange={(e) =>
                                    setSelectedFilters({ ...selectedFilters, version: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Tất cả --</option>
                                {getUniqueValues("version").map((version) => (
                                    <option key={version} value={version}>
                                        {version}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* NOTE: Filter màu sắc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Màu sắc
                            </label>
                            <select
                                value={selectedFilters.color}
                                onChange={(e) =>
                                    setSelectedFilters({ ...selectedFilters, color: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Tất cả --</option>
                                {getUniqueValues("color").map((color) => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* NOTE: Filter cấu hình */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cấu hình
                            </label>
                            <select
                                value={selectedFilters.configuration}
                                onChange={(e) =>
                                    setSelectedFilters({
                                        ...selectedFilters,
                                        configuration: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Tất cả --</option>
                                {getUniqueValues("configuration").map((config) => (
                                    <option key={config} value={config}>
                                        {config}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* NOTE: Nút reset filters */}
                    <button
                        onClick={handleResetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Đặt lại bộ lọc
                    </button>
                </div>

                {/* NOTE: Danh sách xe */}
                <div className="p-6">
                    {filteredVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredVehicles.map((vehicle) => (
                                <button
                                    key={vehicle.vehicleTypeDetailId}
                                    onClick={() => handleSelectVehicle(vehicle)}
                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                >
                                    {/* NOTE: Hình ảnh xe (nếu có) */}
                                    {vehicle.vehicleImage && (
                                        <div className="mb-3 bg-gray-100 rounded h-40 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={vehicle.vehicleImage}
                                                alt={vehicle.version}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* NOTE: Thông tin chi tiết */}
                                    <div className="space-y-2">
                                        <p className="font-semibold text-gray-900">
                                            ID: {vehicle.vehicleTypeDetailId}
                                        </p>
                                        {vehicle.version && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Phiên bản:</span>{" "}
                                                {vehicle.version}
                                            </p>
                                        )}
                                        {vehicle.color && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Màu:</span> {vehicle.color}
                                            </p>
                                        )}
                                        {vehicle.configuration && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Cấu hình:</span>{" "}
                                                {vehicle.configuration}
                                            </p>
                                        )}
                                        {vehicle.features && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Tính năng:</span>{" "}
                                                <span className="line-clamp-2">{vehicle.features}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* NOTE: Nút chọn */}
                                    <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                                        Chọn
                                    </button>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg font-medium">Không tìm thấy xe phù hợp</p>
                            <p className="text-sm mt-1">Vui lòng thử thay đổi bộ lọc</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailSelector;
