import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { productApi } from "../../services/api/admin/productApi";
import { showSuccess, showError } from "../../components/shared/toast";
import ProductModal from "../../components/admin/ProductModal";

/**
 * Trang Quản lý sản phẩm - dành cho Admin
 */
const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Lấy danh sách sản phẩm từ API
    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getAllProducts({
                page,
                size: 10,
                search: searchTerm,
            });

            if (response.success || response.data) {
                const data = response.data || response;
                setProducts(Array.isArray(data) ? data : data.content || []);
                setTotalPages(data.totalPages || 1);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách sản phẩm:", error);
            showError("Không thể tải danh sách sản phẩm");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (value) => {
        setSearchTerm(value);
        setPage(0);
    };

    const handleOpenModal = (product = null) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSubmitProduct = async (formData) => {
        try {
            setSubmitLoading(true);
            if (selectedProduct?.id) {
                // Update existing product
                await productApi.updateProduct(selectedProduct.id, formData);
                showSuccess("Cập nhật sản phẩm thành công");
            } else {
                // Create new product
                await productApi.createProduct(formData);
                showSuccess("Thêm sản phẩm thành công");
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            console.error("Lỗi lưu sản phẩm:", error);
            showError("Không thể lưu sản phẩm");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await productApi.deleteProduct(id);
                showSuccess("Xóa sản phẩm thành công");
                fetchProducts();
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);
                showError("Không thể xóa sản phẩm");
            }
        }
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
                <p className="text-gray-600">Quản lý danh sách các sản phẩm xe hơi</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                    disabled={loading}
                >
                    <Plus className="w-5 h-5" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">Không có sản phẩm nào</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên sản phẩm</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Danh mục</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tồn kho</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Product Modal */}
            <ProductModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitProduct}
                product={selectedProduct}
                isLoading={submitLoading}
            />
        </div>
    );
};

export default ProductManagement;
