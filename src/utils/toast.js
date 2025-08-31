// utils/toast.js
import { toast } from "react-toastify";

// موفقیت
export const successToast = (message) => {
  toast.success(`✅ ${message}`, {
    style: {
      borderRadius: "12px",
      background: "#f0fff4",
      color: "#38a169",
      fontSize: "15px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    progressStyle: {
      background: "#38a169",
    },
  });
};

// خطا
export const errorToast = (message) => {
  toast.error(`❌ ${message}`, {
    style: {
      borderRadius: "12px",
      background: "#fff5f5",
      color: "#e53e3e",
      fontSize: "15px",
      fontWeight: "500",
    },
    progressStyle: {
      background: "#e53e3e",
    },
  });
};

// هشدار
export const warningToast = (message) => {
  toast.warn(`⚠️ ${message}`, {
    style: {
      borderRadius: "12px",
      background: "#fffaf0",
      color: "#dd6b20",
      fontSize: "15px",
      fontWeight: "500",
    },
    progressStyle: {
      background: "#dd6b20",
    },
  });
};

// اطلاعات
export const infoToast = (message) => {
  toast.info(`ℹ️ ${message}`, {
    style: {
      borderRadius: "12px",
      background: "#ebf8ff",
      color: "#3182ce",
      fontSize: "15px",
      fontWeight: "500",
    },
    progressStyle: {
      background: "#3182ce",
    },
  });
};