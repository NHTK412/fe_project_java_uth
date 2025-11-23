import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

/**
 * Trang Quản lý sản phẩm - dành cho Admin
 */
const ProductManagement = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Xe Honda City", category: "Sedan", price: "500,000,000", stock: 10, status: "Active" },
        { id: 2, name: "Xe Honda Accord", category: "Sedan", price: "800,000,000", stock: 5, status: "Active" },
        { id: 3, name: "Xe Honda CR-V", category: "SUV", price: "1,000,000,000", stock: 8, status: "Active" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
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
            </div>
        </div>
    );
};

export default ProductManagement;
