// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// const getAuthHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// // ===== REVENUE DATA =====
// export const fetchRevenueData = async (period = "7days") => {
//   try {
//     const today = new Date();
//     let startDate;

//     switch (period) {
//       case "7days":
//         startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 7);
//         break;
//       case "30days":
//         startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 30);
//         break;
//       case "90days":
//         startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 90);
//         break;
//       default:
//         startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 7);
//     }

//     const endDate = new Date();

//     const formatDate = (date) => {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     const requestBody = {
//       startDate: formatDate(startDate),
//       endDate: formatDate(endDate),
//       agencyId: null,
//       status: null,
//       groupBy: "DAY",
//       page: 0,
//       size: 100,
//     };

//     console.log(" Fetching revenue data with:", requestBody);

//     const response = await fetch(`${API_BASE_URL}/reports/revenue`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Revenue API error:", errorText);
//       throw new Error("Failed to fetch revenue data");
//     }

//     const data = await response.json();
//     console.log(" Revenue API response:", data);

//     // Xử lý response
//     let reportData = [];
//     if (Array.isArray(data)) {
//       reportData = data;
//     } else if (data?.data && Array.isArray(data.data)) {
//       reportData = data.data;
//     } else if (data?.content && Array.isArray(data.content)) {
//       reportData = data.content;
//     }

//     // Transform data - FIX NaN Invalid Date
//     const transformedData = reportData
//       .filter((item) => item.period) // Lọc bỏ items không có period
//       .map((item) => {
//         // Parse period an toàn hơn
//         let formattedDate = "N/A";
//         try {
//           const dateStr = item.period;
//           // Nếu period là "2025-01-15", parse trực tiếp
//           const dateParts = dateStr.split("-");
//           if (dateParts.length === 3) {
//             const date = new Date(
//               parseInt(dateParts[0]),
//               parseInt(dateParts[1]) - 1,
//               parseInt(dateParts[2])
//             );
//             const day = date.getDate();
//             const monthNames = [
//               "Jan",
//               "Feb",
//               "Mar",
//               "Apr",
//               "May",
//               "Jun",
//               "Jul",
//               "Aug",
//               "Sep",
//               "Oct",
//               "Nov",
//               "Dec",
//             ];
//             const month = monthNames[date.getMonth()];
//             formattedDate = `${day} ${month}`;
//           }
//         } catch (e) {
//           console.error("Error parsing date:", item.period, e);
//         }

//         return {
//           date: formattedDate,
//           direct: Math.floor((item.totalRevenue || 0) * 0.6),
//           organic: Math.floor((item.totalRevenue || 0) * 0.25),
//           referral: Math.floor((item.totalRevenue || 0) * 0.15),
//         };
//       })
//       .filter((item) => item.date !== "N/A"); // Lọc bỏ dates không valid

//     console.log(" Transformed revenue data:", transformedData);
//     return transformedData;
//   } catch (error) {
//     console.error(" Error fetching revenue data:", error);
//     return [];
//   }
// };

// export const fetchInventoryData = async (period = "7days", limit = 4) => {
//   try {
//     console.log(" Fetching inventory data...");

//     const response = await fetch(`${API_BASE_URL}/reports/inventory`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Inventory API error:", errorText);
//       throw new Error("Failed to fetch inventory data");
//     }

//     const data = await response.json();
//     console.log(" Inventory API response:", data);

//     // Xử lý response
//     let inventoryData = [];
//     if (data?.success && data?.data) {
//       inventoryData = data.data;
//     } else if (Array.isArray(data)) {
//       inventoryData = data;
//     } else if (data?.data && Array.isArray(data.data)) {
//       inventoryData = data.data;
//     } else if (data?.content && Array.isArray(data.content)) {
//       inventoryData = data.content;
//     }

//     console.log(" Raw inventory data:", inventoryData);

//     // Group by agency - FIX NaN
//     const agencyMap = {};
//     inventoryData.forEach((item) => {
//       // Kiểm tra agencyName hợp lệ
//       const agencyName =
//         item.agencyName && item.agencyName !== "null" && item.agencyName !== ""
//           ? item.agencyName
//           : "Đại lý không rõ";

//       if (!agencyMap[agencyName]) {
//         agencyMap[agencyName] = {
//           name: agencyName,
//           value: 0,
//         };
//       }

//       // Kiểm tra totalValue hợp lệ
//       const totalValue =
//         typeof item.totalValue === "number" && !isNaN(item.totalValue)
//           ? item.totalValue
//           : 0;

//       agencyMap[agencyName].value += totalValue;
//     });

//     // Convert to array và sort
//     const sortedAgencies = Object.values(agencyMap)
//       .filter((item) => item.value > 0) // Lọc bỏ agency có value = 0
//       .sort((a, b) => b.value - a.value)
//       .slice(0, limit);

//     // Add id
//     const result = sortedAgencies.map((item, idx) => ({
//       id: idx + 1,
//       name: item.name,
//       value: item.value,
//     }));

//     console.log(" Transformed inventory data:", result);
//     return result;
//   } catch (error) {
//     console.error(" Error fetching inventory data:", error);
//     return [];
//   }
// };

// // ===== TOTAL STATS =====

// // Tổng người dùng
// export const fetchTotalUsers = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/customers/total-count`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch total users");
//     }

//     const data = await response.json();
//     console.log("👥 Total users response:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching total users:", error);
//     return { data: 0 };
//   }
// };

// // Tổng đại lý
// export const fetchTotalDealers = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/employees/agencies/1/count`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch total dealers");
//     }

//     const data = await response.json();
//     console.log(" Total dealers response:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching total dealers:", error);
//     return { data: 0 };
//   }
// };

// // Tổng nhân viên
// export const fetchTotalEmployees = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/customers/total-count`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch total employees");
//     }

//     const data = await response.json();
//     console.log("Total employees response:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching total employees:", error);
//     return { data: 0 };
//   }
// };

// // Tổng doanh thu
// export const fetchTotalRevenue = async () => {
//   try {
//     const today = new Date();
//     const startDate = new Date(today);
//     startDate.setMonth(startDate.getMonth() - 12);

//     const formatDate = (date) => {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     const requestBody = {
//       startDate: formatDate(startDate),
//       endDate: formatDate(today),
//       agencyId: null,
//       status: null,
//       groupBy: "DAY",
//     };

//     const response = await fetch(
//       `${API_BASE_URL}/reports/revenue/summary/all`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(requestBody),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch total revenue");
//     }

//     const data = await response.json();
//     console.log("💰 Total revenue response:", data);

//     // Xử lý response
//     if (data?.data?.totalRevenue !== undefined) {
//       return { data: data.data.totalRevenue };
//     } else if (data?.totalRevenue !== undefined) {
//       return { data: data.totalRevenue };
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching total revenue:", error);
//     return { data: 0 };
//   }
// };

// // Đại lý theo thành phố
// export const fetchDealersByCity = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/dealers/by-city`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch dealers by city");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching dealers by city:", error);
//     return {
//       success: true,
//       data: [
//         { city: "Hồ Chí Minh", count: 25 },
//         { city: "Hà Nội", count: 18 },
//         { city: "Đà Nẵng", count: 12 },
//         { city: "Hải Phòng", count: 8 },
//         { city: "Cần Thơ", count: 5 },
//         { city: "Phú Quốc", count: 3 },
//         { city: "Quần đảo Hoàng Sa", count: 0 },
//         { city: "Quần đảo Trường Sa", count: 0 },
//       ],
//     };
//   }
// };

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ===== REVENUE DATA - Top 3 Agencies =====
export const fetchRevenueData = async (period = "7days") => {
  try {
    const today = new Date();
    let startDate;

    switch (period) {
      case "7days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
    }

    const endDate = new Date();

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const requestBody = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      agencyId: null,
      status: null,
      groupBy: "AGENCY", // Nhóm theo đại lý
      page: 0,
      size: 100,
    };

    console.log("📊 Fetching revenue data by agency:", requestBody);

    const response = await fetch(`${API_BASE_URL}/reports/revenue`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Revenue API error:", errorText);
      throw new Error("Failed to fetch revenue data");
    }

    const data = await response.json();
    console.log("✅ Revenue API response:", data);

    // Xử lý response
    let reportData = [];
    if (Array.isArray(data)) {
      reportData = data;
    } else if (data?.data && Array.isArray(data.data)) {
      reportData = data.data;
    } else if (data?.content && Array.isArray(data.content)) {
      reportData = data.content;
    }

    // Lọc và sort theo doanh thu, lấy top 3
    const topAgencies = reportData
      .filter((item) => item.agencyName && item.totalRevenue > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3);

    // Transform data cho biểu đồ - giữ tên đại lý thật
    const transformedData = topAgencies.map((item) => ({
      agencyName: item.agencyName || "Đại lý không rõ",
      totalRevenue: item.totalRevenue || 0,
      totalOrders: item.totalOrders || 0,
      avgOrderValue: item.totalOrders
        ? Math.round(item.totalRevenue / item.totalOrders)
        : 0,
    }));

    console.log("📈 Top 3 agencies revenue data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("❌ Error fetching revenue data:", error);
    return [];
  }
};

// ===== INVENTORY DATA - Top Agencies =====
export const fetchInventoryData = async (period = "7days", limit = 4) => {
  try {
    console.log("📦 Fetching inventory data...");

    const response = await fetch(`${API_BASE_URL}/reports/inventory`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Inventory API error:", errorText);
      throw new Error("Failed to fetch inventory data");
    }

    const data = await response.json();
    console.log("✅ Inventory API response:", data);

    // Xử lý response
    let inventoryData = [];
    if (data?.success && data?.data) {
      inventoryData = data.data;
    } else if (Array.isArray(data)) {
      inventoryData = data;
    } else if (data?.data && Array.isArray(data.data)) {
      inventoryData = data.data;
    } else if (data?.content && Array.isArray(data.content)) {
      inventoryData = data.content;
    }

    console.log("📦 Raw inventory data:", inventoryData);

    // Group by agency
    const agencyMap = {};
    inventoryData.forEach((item) => {
      const agencyName =
        item.agencyName && item.agencyName !== "null" && item.agencyName !== ""
          ? item.agencyName
          : "Đại lý không rõ";

      if (!agencyMap[agencyName]) {
        agencyMap[agencyName] = {
          name: agencyName,
          value: 0,
        };
      }

      const totalValue =
        typeof item.totalValue === "number" && !isNaN(item.totalValue)
          ? item.totalValue
          : 0;

      agencyMap[agencyName].value += totalValue;
    });

    // Convert to array và sort
    const sortedAgencies = Object.values(agencyMap)
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);

    // Add id
    const result = sortedAgencies.map((item, idx) => ({
      id: idx + 1,
      name: item.name,
      value: item.value,
    }));

    console.log("📊 Transformed inventory data:", result);
    return result;
  } catch (error) {
    console.error("❌ Error fetching inventory data:", error);
    return [];
  }
};

// ===== TOTAL STATS =====

export const fetchTotalUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/total-count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total users");
    }

    const data = await response.json();
    console.log("👥 Total users response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching total users:", error);
    return { data: 0 };
  }
};

export const fetchTotalDealers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/agencies/1/count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total dealers");
    }

    const data = await response.json();
    console.log("🏢 Total dealers response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching total dealers:", error);
    return { data: 0 };
  }
};

export const fetchTotalEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/total-count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total employees");
    }

    const data = await response.json();
    console.log("👔 Total employees response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching total employees:", error);
    return { data: 0 };
  }
};

export const fetchTotalRevenue = async () => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 12);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const requestBody = {
      startDate: formatDate(startDate),
      endDate: formatDate(today),
      agencyId: null,
      status: null,
      groupBy: "DAY",
    };

    const response = await fetch(
      `${API_BASE_URL}/reports/revenue/summary/all`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch total revenue");
    }

    const data = await response.json();
    console.log("💰 Total revenue response:", data);

    if (data?.data?.totalRevenue !== undefined) {
      return { data: data.data.totalRevenue };
    } else if (data?.totalRevenue !== undefined) {
      return { data: data.totalRevenue };
    }

    return data;
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return { data: 0 };
  }
};

export const fetchDealersByCity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dealers/by-city`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dealers by city");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dealers by city:", error);
    return {
      success: true,
      data: [
        { city: "Hồ Chí Minh", count: 25 },
        { city: "Hà Nội", count: 18 },
        { city: "Đà Nẵng", count: 12 },
        { city: "Hải Phòng", count: 8 },
        { city: "Cần Thơ", count: 5 },
        { city: "Phú Quốc", count: 3 },
        { city: "Quần đảo Hoàng Sa", count: 0 },
        { city: "Quần đảo Trường Sa", count: 0 },
      ],
    };
  }
};
