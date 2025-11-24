import { useEffect, useState } from 'react';
import vehicleTypeApi from '../../services/api/vehicleTypeApi';
import { toast } from 'react-toastify';
import { X, Check, Minus } from 'lucide-react';

const CompareVehicleModal = ({ vehicle1Id, vehicle2Id, onClose }) => {
    const [vehicle1, setVehicle1] = useState(null);
    const [vehicle2, setVehicle2] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadVehicleDetails = async () => {
            setLoading(true);
            try {
                const [response1, response2] = await Promise.all([
                    vehicleTypeApi.getVehicleTypeDetailById(vehicle1Id),
                    vehicleTypeApi.getVehicleTypeDetailById(vehicle2Id)
                ]);

                if (response1.success && response1.data) {
                    setVehicle1(response1.data);
                }
                if (response2.success && response2.data) {
                    setVehicle2(response2.data);
                }
            } catch (error) {
                console.error('Error loading vehicle details:', error);
                toast.error('Không thể tải thông tin chi tiết xe');
            } finally {
                setLoading(false);
            }
        };

        if (vehicle1Id && vehicle2Id) {
            loadVehicleDetails();
        }
    }, [vehicle1Id, vehicle2Id]);

    const CompareRow = ({ label, value1, value2, type = 'text' }) => {
        let isDifferent = false;
        let displayValue1 = value1 || '-';
        let displayValue2 = value2 || '-';

        if (type === 'number') {
            isDifferent = Number(value1) !== Number(value2);
            displayValue1 = value1 ? Number(value1).toLocaleString('vi-VN') : '-';
            displayValue2 = value2 ? Number(value2).toLocaleString('vi-VN') : '-';
        } else if (type === 'currency') {
            isDifferent = Number(value1) !== Number(value2);
            displayValue1 = value1 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value1) : '-';
            displayValue2 = value2 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value2) : '-';
        } else if (type === 'boolean') {
            isDifferent = Boolean(value1) !== Boolean(value2);
            displayValue1 = value1 ? <Check className="text-green-600" size={20} /> : <Minus className="text-gray-400" size={20} />;
            displayValue2 = value2 ? <Check className="text-green-600" size={20} /> : <Minus className="text-gray-400" size={20} />;
        } else {
            isDifferent = value1 !== value2;
        }

        return (
            <tr className={`${isDifferent ? 'bg-yellow-50' : ''} border-b border-gray-200`}>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
                    {label}
                </td>
                <td className={`px-4 py-3 text-center ${isDifferent ? 'font-semibold' : ''}`}>
                    {displayValue1}
                </td>
                <td className={`px-4 py-3 text-center ${isDifferent ? 'font-semibold' : ''}`}>
                    {displayValue2}
                </td>
            </tr>
        );
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-center mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!vehicle1 || !vehicle2) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        So sánh phiên bản
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-50 border-b-2 border-blue-200">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-blue-50 z-10">
                                        Thông số
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                        <div className="mb-2">
                                            {vehicle1.vehicleImage && (
                                                <img
                                                    src={`http://localhost:8080/api/images/${vehicle1.vehicleImage}`}
                                                    alt={vehicle1.version}
                                                    className="w-32 h-20 object-cover rounded mx-auto mb-2"
                                                />
                                            )}
                                        </div>
                                        {vehicle1.version}
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                        <div className="mb-2">
                                            {vehicle2.vehicleImage && (
                                                <img
                                                    src={`http://localhost:8080/api/images/${vehicle2.vehicleImage}`}
                                                    alt={vehicle2.version}
                                                    className="w-32 h-20 object-cover rounded mx-auto mb-2"
                                                />
                                            )}
                                        </div>
                                        {vehicle2.version}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <CompareRow label="Mã chi tiết" value1={vehicle1.vehicleTypeDetailId} value2={vehicle2.vehicleTypeDetailId} />
                                <CompareRow label="Phiên bản" value1={vehicle1.version} value2={vehicle2.version} />
                                <CompareRow label="Màu sắc" value1={vehicle1.color} value2={vehicle2.color} />
                                <CompareRow label="Cấu hình" value1={vehicle1.configuration} value2={vehicle2.configuration} />
                                <CompareRow label="Tính năng" value1={vehicle1.features} value2={vehicle2.features} />
                                <CompareRow label="Giá xe" value1={vehicle1.price} value2={vehicle2.price} type="currency" />
                                <CompareRow label="Công suất (HP)" value1={vehicle1.horsePower} value2={vehicle2.horsePower} type="number" />
                                <CompareRow label="Mô-men xoắn (Nm)" value1={vehicle1.torque} value2={vehicle2.torque} type="number" />
                                <CompareRow label="Dung lượng pin (kWh)" value1={vehicle1.batteryCapacity} value2={vehicle2.batteryCapacity} type="number" />
                                <CompareRow label="Phạm vi hoạt động (km)" value1={vehicle1.range} value2={vehicle2.range} type="number" />
                                <CompareRow label="Thời gian sạc nhanh (phút)" value1={vehicle1.fastChargingTime} value2={vehicle2.fastChargingTime} type="number" />
                                <CompareRow label="Số chỗ ngồi" value1={vehicle1.seatingCapacity} value2={vehicle2.seatingCapacity} type="number" />
                                <CompareRow label="Số cửa" value1={vehicle1.numberOfDoors} value2={vehicle2.numberOfDoors} type="number" />
                                <CompareRow label="Chiều dài (mm)" value1={vehicle1.length} value2={vehicle2.length} type="number" />
                                <CompareRow label="Chiều rộng (mm)" value1={vehicle1.width} value2={vehicle2.width} type="number" />
                                <CompareRow label="Chiều cao (mm)" value1={vehicle1.height} value2={vehicle2.height} type="number" />
                                <CompareRow label="Trọng lượng (kg)" value1={vehicle1.weight} value2={vehicle2.weight} type="number" />
                                <CompareRow label="Khoảng sáng gầm xe (mm)" value1={vehicle1.groundClearance} value2={vehicle2.groundClearance} type="number" />
                                <CompareRow label="Tự lái" value1={vehicle1.autopilot} value2={vehicle2.autopilot} type="boolean" />
                                <CompareRow label="Cảm biến lùi" value1={vehicle1.parkingSensors} value2={vehicle2.parkingSensors} type="boolean" />
                                <CompareRow label="Camera lùi" value1={vehicle1.reversingCamera} value2={vehicle2.reversingCamera} type="boolean" />
                                <CompareRow label="Cửa sổ trời" value1={vehicle1.sunroof} value2={vehicle2.sunroof} type="boolean" />
                                <CompareRow label="Hệ thống âm thanh" value1={vehicle1.soundSystem} value2={vehicle2.soundSystem} />
                                <CompareRow label="Kết nối Bluetooth" value1={vehicle1.bluetooth} value2={vehicle2.bluetooth} type="boolean" />
                                <CompareRow label="Cổng USB" value1={vehicle1.usbPorts} value2={vehicle2.usbPorts} type="number" />
                            </tbody>
                        </table>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">💡 Ghi chú:</span> Các thông số khác biệt được tô sáng màu vàng
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompareVehicleModal;
