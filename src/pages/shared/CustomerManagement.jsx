import { useEffect, useState, useCallback } from 'react';
import customerApi from '../../services/api/customerApi';
import { toast } from 'react-toastify';
import CustomerModal from '../../components/shared/CustomerModal';
import CustomerDetailModal from '../../components/shared/CustomerDetailModal';
import { Trash2, Edit, Eye, UserPlus } from 'lucide-react';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterMembership, setFilterMembership] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

    const genderMap = {
        'MALE': 'Nam',
        'FEMALE': 'Nữ',
        'OTHER': 'Khác'
    };

    const membershipLevelMap = {
        'COPPER': { label: 'Đồng', color: 'bg-orange-100 text-orange-800' },
        'SILVER': { label: 'Bạc', color: 'bg-gray-100 text-gray-800' },
        'GOLD': { label: 'Vàng', color: 'bg-yellow-100 text-yellow-800' },
        'PLATINUM': { label: 'Bạch kim', color: 'bg-purple-100 text-purple-800' },
        'DIAMOND': { label: 'Kim cương', color: 'bg-blue-100 text-blue-800' }
    };

    // Lấy danh sách khách hàng
    const loadCustomers = useCallback(async (page, size) => {
        setLoading(true);
        try {
            const response = await customerApi.getCustomers(page, size);
            console.log('=== Customers Response ===', response);

            if (response.success && response.data) {
                setCustomers(response.data.content || []);
                setTotalElements(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setCustomers([]);
                setTotalElements(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error loading customers:', error);
            toast.error('Không thể tải danh sách khách hàng');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCustomers(currentPage, pageSize);
    }, [currentPage, pageSize, loadCustomers]);

    // Filter và search
    const filteredCustomers = customers.filter(customer => {
        const matchSearch = searchTerm === '' ||
            customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phoneNumber?.includes(searchTerm) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchGender = filterGender === '' || customer.gender === filterGender;
        const matchMembership = filterMembership === '' || customer.membershipLevel === filterMembership;

        return matchSearch && matchGender && matchMembership;
    });

    const handleCreateCustomer = () => {
        setModalMode('create');
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };

    const handleEditCustomer = (customer) => {
        setModalMode('edit');
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleViewDetail = (customer) => {
        setSelectedCustomer(customer);
        setIsDetailModalOpen(true);
    };

    const handleDeleteCustomer = async (customerId, customerName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"?`)) {
            try {
                const response = await customerApi.deleteCustomer(customerId);
                if (response.success) {
                    toast.success('Xóa khách hàng thành công');
                    loadCustomers(currentPage, pageSize);
                } else {
                    toast.error(response.message || 'Xóa khách hàng thất bại');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast.error('Không thể xóa khách hàng');
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
        loadCustomers(currentPage, pageSize);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalOpen(false);
        setSelectedCustomer(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
                    <p className="text-gray-600 mt-1">Quản lý thông tin khách hàng</p>
                </div>
                <button
                    onClick={handleCreateCustomer}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <UserPlus size={20} />
                    Thêm khách hàng
                </button>
            </div>

            {/* Search và Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm (Tên, SĐT, Email)
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                        </label>
                        <select
                            value={filterGender}
                            onChange={(e) => {
                                setFilterGender(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            {Object.entries(genderMap).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hạng thành viên
                        </label>
                        <select
                            value={filterMembership}
                            onChange={(e) => {
                                setFilterMembership(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            {Object.entries(membershipLevelMap).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số hàng/trang
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có khách hàng</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã KH</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Họ tên</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Giới tính</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Ngày sinh</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">SĐT</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Hạng</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.customerId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-blue-600">
                                            #{customer.customerId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{customer.customerName}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {genderMap[customer.gender] || customer.gender}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {formatDate(customer.birthDate)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {customer.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${membershipLevelMap[customer.membershipLevel]?.color || 'bg-gray-100 text-gray-800'}`}>
                                                {membershipLevelMap[customer.membershipLevel]?.label || customer.membershipLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(customer)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditCustomer(customer)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.customerId, customer.customerName)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                    Hiển thị {filteredCustomers.length} / {totalElements} khách hàng
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Trước
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages > 0 ? totalPages : 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 rounded-lg font-medium ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* Customer Modal (Create/Edit) */}
            {isModalOpen && (
                <CustomerModal
                    mode={modalMode}
                    customer={selectedCustomer}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Customer Detail Modal */}
            {isDetailModalOpen && selectedCustomer && (
                <CustomerDetailModal
                    customer={selectedCustomer}
                    onClose={handleDetailModalClose}
                />
            )}
        </div>
    );
};

export default CustomerManagement;
