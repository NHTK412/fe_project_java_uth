import { Search, RefreshCw, Download, Filter } from "lucide-react";

const WarehouseReleaseFilter = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
  onExport,
}) => {
  const sortOptions = [
    { value: "id", label: "Mã phiếu" },
    { value: "warehouseReleaseNoteDate", label: "Ngày xuất" },
    { value: "totalAmount", label: "Tổng tiền" },
    { value: "status", label: "Trạng thái" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[250px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, ghi chú, trạng thái..."
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sắp xếp:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange?.(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Button */}
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600">
        <Filter className="w-4 h-4" />
        Lọc
      </button>

      {/* Export CSV */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600"
      >
        <Download className="w-4 h-4" />
        Xuất CSV
      </button>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        title="Làm mới"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WarehouseReleaseFilter;
