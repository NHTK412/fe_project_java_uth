const API_BASE = "http://localhost:8080/api";

// Lấy báo cáo doanh thu theo filter
export const fetchRevenueReport = async (request) => {
  const response = await fetch(`${API_BASE}/reports/revenue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Failed to fetch revenue report");
  return response.json();
};

// Xuất báo cáo Excel
export const exportRevenueExcel = async (request) => {
  const response = await fetch(`${API_BASE}/reports/revenue/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Failed to export revenue report");
  return response.blob();
};

// Lấy tổng doanh thu toàn bộ
export const fetchTotalRevenueAll = async (request) => {
  const response = await fetch(`${API_BASE}/reports/revenue/summary/all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Failed to fetch total revenue");
  return response.json();
};

// Lấy tổng doanh thu theo đại lý
export const fetchTotalRevenueByAgency = async (agencyId) => {
  const response = await fetch(
    `${API_BASE}/reports/revenue/summary/agency/${agencyId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch revenue by agency");
  return response.json();
};

// Lấy tổng doanh thu theo trạng thái
export const fetchTotalRevenueByStatus = async (status) => {
  const response = await fetch(
    `${API_BASE}/reports/revenue/summary/status/${status}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch revenue by status");
  return response.json();
};

// Lấy tổng doanh thu theo tất cả trạng thái (gọi nhiều API song song)
export const fetchRevenueByAllStatuses = async () => {
  const statuses = [
    "PENDING",
    "PAID",
    "PENDING_DELIVERY",
    "DELIVERED",
    "INSTALLMENT",
  ];

  const results = await Promise.all(
    statuses.map(async (status) => {
      try {
        const response = await fetch(
          `${API_BASE}/reports/revenue/summary/status/${status}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) return { status, data: null };
        const res = await response.json();
        return { status, data: res.data };
      } catch {
        return { status, data: null };
      }
    })
  );

  return results.reduce((acc, { status, data }) => {
    acc[status] = data || {
      totalRevenue: 0,
      totalOrders: 0,
      totalDiscount: 0,
      totalQuantity: 0,
      netRevenue: 0,
    };
    return acc;
  }, {});
};

// Lấy danh sách đại lý (để filter)
export const fetchAgencies = async () => {
  const response = await fetch(`${API_BASE}/agencies`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch agencies");
  return response.json();
};
