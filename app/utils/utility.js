// Utility functions for Next.js application

export const toastifySuccess = (message) => {
  if (typeof window !== "undefined") {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
};

export const toastifyError = (message) => {
  if (typeof window !== "undefined") {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
};

export const formatIndianNumber = (number) => {
  if (!number) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getApiUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://liveapi.astrocall.live/api/";
  }

  const urlSet = window.location.origin;
  return urlSet === "https://astrocall.live"
    ? "https://api.astrocall.live/api"
    : "https://liveapi.astrocall.live/api/";
};

export const saveToLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value);
  }
};

export const getFromLocalStorage = (key, isObject = false) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return isObject && value ? JSON.parse(value) : value;
  }
  return null;
};

export const removeFromLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const getShowingDateText = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getShowingMonthDateYear = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};


export const customStyle = {
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    border: state.isFocused
      ? '2px solid #F97316'
      : '2px solid #d1d5db',
    borderRadius: '0.5rem',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    boxShadow: state.isFocused
      ? '0 0 0 2px rgba(249, 115, 22, 0.2)'
      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    minHeight: '38px',
    '&:hover': {
      borderColor: state.isFocused ? '#F97316' : '#d1d5db',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
};
