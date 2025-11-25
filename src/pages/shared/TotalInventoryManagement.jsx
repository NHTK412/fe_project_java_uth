import { useState, useEffect } from "react";
import { Eye, Loader, AlertCircle, Building2, MapPin, Phone, Mail, Search } from "lucide-react";
import { fetchAgencies } from "../../services/api/agencyApi";
import AgencyInventoryDetailModal from "../../components/shared/AgencyInventoryDetailModal";

const TotalInventoryManagement = () => {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAgencyId, setSelectedAgencyId] = useState(null);
    const [selectedAgencyName, setSelectedAgencyName] = useState("");

    useEffect(() => {
        fetchAgenciesData();
    }, [page, size]);

    const fetchAgenciesData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchAgencies(page, size);
            if (res.success) {
                setAgencies(res.data || []);
            } else {
                setError(res.message || "Không thể tải danh sách đại lý");
                setAgencies([]);
            }
        } catch (err) {
            setError(err.message || "Lỗi khi tải dữ liệu");
            setAgencies([]);
            console.error("Error fetching agencies:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewInventory = (agency) => {
        setSelectedAgencyId(agency.agencyId);
        setSelectedAgencyName(agency.agencyName);
        setShowDetailModal(true);
    };

    const filteredAgencies = agencies.filter((agency) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            agency.agencyName?.toLowerCase().includes(searchLower) ||
            agency.address?.toLowerCase().includes(searchLower) ||
            agency.phoneNumber?.includes(searchLower) ||
            agency.email?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý tồn kho tổng</h1>
                    <p className="text-gray-600 mt-1">Xem tồn kho của các đại lý</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên đại lý, địa chỉ, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800 font-medium">Lỗi</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="mt-4 text-gray-600">Đang tải danh sách đại lý...</p>
                </div>
            ) : (
                <>
                    {/* Agency Cards */}
                    {filteredAgencies.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">
                                {searchTerm ? "Không tìm thấy đại lý phù hợp" : "Chưa có đại lý nào"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAgencies.map((agency) => (
                                <div
                                    key={agency.agencyId}
                                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">
                                                    {agency.agencyName}
                                                </h3>
                                                <p className="text-sm text-gray-500">ID: #{agency.agencyId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {agency.address && (
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                                <span>{agency.address}</span>
                                            </div>
                                        )}
                                        {agency.phoneNumber && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{agency.phoneNumber}</span>
                                            </div>
                                        )}
                                        {agency.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span>{agency.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleViewInventory(agency)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem tồn kho
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredAgencies.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{filteredAgencies.length}</span> đại lý
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Trước
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700">Trang {page}</span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={agencies.length < size}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Agency Inventory Detail Modal */}
            <AgencyInventoryDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedAgencyId(null);
                    setSelectedAgencyName("");
                }}
                agencyId={selectedAgencyId}
                agencyName={selectedAgencyName}
            />
        </div>
    );
};

export default TotalInventoryManagement;
