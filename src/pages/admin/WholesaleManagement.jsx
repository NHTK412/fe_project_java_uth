// src/pages/admin/WholesaleManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import {
  fetchAgencyWholesalePrices,
  createAgencyWholesalePrice,
  updateAgencyWholesalePrice,
  deleteAgencyWholesalePrice,
} from "../../services/api/agencyWholesalePriceApi";
import { showSuccess, showError } from "../../components/shared/toast";

function WholesaleManagement() {
  const [wholesales, setWholesales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null); // dữ liệu edit
  const [form, setForm] = useState({
    wholesalePrice: "",
    minimumQuantity: "",
    startDate: "",
    endDate: "",
    status: "Đang Hoạt Động",
  });

  // Load danh sách wholesales
  const loadWholesales = async () => {
    setLoading(true);
    const result = await fetchAgencyWholesalePrices(1, 10);
    if (result.success) {
      setWholesales(Array.isArray(result.data) ? result.data : []);
    } else {
      showError("Load danh sách thất bại");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWholesales();
  }, []);

  const openModal = (data = null) => {
    if (data) {
      setCurrent(data);
      setForm({
        wholesalePrice: data.wholesalePrice,
        minimumQuantity: data.minimumQuantity,
        startDate: data.startDate.slice(0, 16),
        endDate: data.endDate.slice(0, 16),
        status: data.status,
      });
    } else {
      setCurrent(null);
      setForm({
        wholesalePrice: "",
        minimumQuantity: "",
        startDate: "",
        endDate: "",
        status: "Đang Hoạt Động",
      });
    }
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        // update
        const result = await updateAgencyWholesalePrice(current.agencyWholesalePriceId, form);
        if (result.success) {
          showSuccess("Cập nhật thành công");
          loadWholesales();
          handleClose();
        } else showError(result.message);
      } else {
        // create
        const result = await createAgencyWholesalePrice(form);
        if (result.success) {
          showSuccess("Tạo mới thành công");
          loadWholesales();
          handleClose();
        } else showError(result.message);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    const result = await deleteAgencyWholesalePrice(id);
    if (result.success) {
      showSuccess("Xóa thành công");
      loadWholesales();
    } else showError(result.message);
  };

  return (
    <div>
      <h2>Quản lý Wholesale Prices</h2>
      <button onClick={() => openModal()}>
        <Plus /> Thêm mới
      </button>
      <button onClick={loadWholesales}>
        <RefreshCw /> Tải lại
      </button>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Giá bán buôn</th>
              <th>Số lượng tối thiểu</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {wholesales.map((w) => (
              <tr key={w.agencyWholesalePriceId}>
                <td>{w.agencyWholesalePriceId}</td>
                <td>{w.wholesalePrice}</td>
                <td>{w.minimumQuantity}</td>
                <td>{w.startDate}</td>
                <td>{w.endDate}</td>
                <td>{w.status}</td>
                <td>
                  <button onClick={() => openModal(w)}><Edit2 /></button>
                  <button onClick={() => handleDelete(w.agencyWholesalePriceId)}><Trash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{current ? "Cập nhật" : "Thêm mới"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Giá bán buôn:
                <input
                  type="number"
                  name="wholesalePrice"
                  value={form.wholesalePrice}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Số lượng tối thiểu:
                <input
                  type="number"
                  name="minimumQuantity"
                  value={form.minimumQuantity}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Trạng thái:
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Đang Hoạt Động">Đang Hoạt Động</option>
                  <option value="Ngừng Hoạt Động">Ngừng Hoạt Động</option>
                </select>
              </label>
              <button type="submit">{current ? "Cập nhật" : "Tạo mới"}</button>
              <button type="button" onClick={handleClose}><X /> Đóng</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WholesaleManagement;
