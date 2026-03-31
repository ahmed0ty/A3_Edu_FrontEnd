// src/utils/toast.js

import toast from "react-hot-toast";

export const showSuccess = (msg) => {
  toast.success(msg, {
    duration: 3000,
    style: {
      borderLeft: "5px solid #22c55e",
    },
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    duration: 3000,
    style: {
      borderLeft: "5px solid #ef4444",
    },
  });
};

export const showLoading = (msg) => {
  return toast.loading(msg);
};

export const dismissToast = (id) => {
  toast.dismiss(id);
};