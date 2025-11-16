import { toast } from "react-toastify";

// Success
export const showSuccess = (msg = "Thành công!") => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 2000,
    theme: "colored",
  });
};

// Error
export const showError = (msg = "Có lỗi xảy ra!") => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  });
};

// Warning
export const showWarning = (msg = "Cảnh báo!") => {
  toast.warn(msg, {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  });
};

// Info
export const showInfo = (msg = "Thông tin!") => {
  toast.info(msg, {
    position: "top-right",
    autoClose: 2500,
    theme: "colored",
  });
};
