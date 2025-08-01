import axios from "axios";

// API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api-be-marketplace.onrender.com";
// import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    config.headers = config.headers || {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // Handle request aborted errors
    if (error.code === "ECONNABORTED") {
      console.warn("Request was aborted:", error.config?.url);
      return Promise.reject(error);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/auth/")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Use window.location.href for now since we can't access navigate here
        // This will trigger a full page reload and redirect to login
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error("Backend health check failed:", error);
    throw error;
  }
};

// Auth API endpoints
export const authAPI = {
  register: (data: { fullname: string; email: string; password: string }) =>
    api.post("/api/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),

  activateAccount: (token: string) =>
    api.post("/api/auth/activate-account", { token }),

  resendActivation: (email: string) =>
    api.post("/api/auth/resend-activation", { email }),

  forgotPassword: (data: { email: string }) =>
    api.post("/api/auth/forgot-password", data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post("/api/auth/reset-password", data),

  getProfile: () => api.get("/api/auth/profile"),

  updateProfile: (data: {
    fullname?: string;
    shippingAddress?: string;
    phone?: string;
    avatar?: string;
    avatarPublicId?: string;
  }) => api.put("/api/auth/profile", data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/api/auth/update-password", data),
};

// Product API endpoints
export const productAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    order_by?: string;
  }) => {
    const cacheBust = Date.now();
    const finalParams = { ...params, _t: cacheBust };
    return api.get("/api/products", { params: finalParams });
  },

  getById: (id: string) => {
    const cacheBust = Date.now();
    return api.get(`/api/products/${id}?_t=${cacheBust}`);
  },

  getRelated: (productId: string, limit?: number) => {
    const cacheBust = Date.now();
    const params = { limit, _t: cacheBust };
    return api.get(`/api/products/${productId}/related`, { params });
  },

  create: (data: any) => {
    return api.post("/api/products", data);
  },

  update: (id: string, data: any) => {
    return api.put(`/api/products/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/api/products/${id}`);
  },

  uploadImage: async (file: File, retries = 3) => {
    // Validate file parameter
    if (!file) {
      throw new Error("No file provided for upload");
    }

    if (!(file instanceof File)) {
      throw new Error("Invalid file object provided");
    }

    if (file.size === 0) {
      throw new Error("File is empty");
    }

    const formData = new FormData();
    formData.append("image", file);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await api.post("/api/upload/product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 second timeout
        });

        return response;
      } catch (error: any) {
        console.error(`Upload attempt ${attempt} failed:`, error);
        if (error.response?.status === 429 && attempt < retries) {
          // Rate limited - wait before retrying
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff

          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
        throw error;
      }
    }
  },
};

// Category API endpoints
export const categoryAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get("/api/categories", { params }),

  getById: (id: string) => api.get(`/api/categories/${id}`),

  create: (data: {
    name: string;
    description?: string;
    thumbnailImage?: string;
    thumbnailImagePublicId?: string;
  }) => api.post("/api/categories", data),

  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      thumbnailImage?: string;
      thumbnailImagePublicId?: string;
    }
  ) => api.put(`/api/categories/${id}`, data),

  delete: (id: string) => api.delete(`/api/categories/${id}`),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/api/upload/category", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Size API endpoints
export const sizeAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get("/api/sizes", { params }),

  getById: (id: string) => api.get(`/api/sizes/${id}`),

  getProductSizes: (productId: string) =>
    api.get(`/api/sizes/product/${productId}`),

  create: (data: { name: string; code: string; order?: number }) =>
    api.post("/api/sizes", data),

  update: (
    id: string,
    data: { name?: string; code?: string; order?: number; isActive?: boolean }
  ) => api.put(`/api/sizes/${id}`, data),

  delete: (id: string) => api.delete(`/api/sizes/${id}`),

  updateProductSizes: (
    productId: string,
    data: { sizes: Array<{ sizeId: string; stock: number }> }
  ) => api.put(`/api/sizes/product/${productId}`, data),
};

// Wishlist API endpoints
export const wishlistAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get("/api/wishlist", {
      params,
      timeout: 10000, // 10 second timeout
    }),

  addToWishlist: (data: { productId: string }) =>
    api.post("/api/wishlist", data, {
      timeout: 10000,
    }),

  removeFromWishlist: (wishlistId: string) =>
    api.delete(`/api/wishlist/${wishlistId}`, {
      timeout: 10000,
    }),

  checkWishlistStatus: (productId: string) =>
    api.get(`/api/wishlist/check/${productId}`, {
      timeout: 5000, // Shorter timeout for status check
    }),
};

// Cart API endpoints
export const cartAPI = {
  getCart: () => api.get("/api/cart"),

  addToCart: (data: {
    productId: string;
    quantity?: number;
    name: string;
    price: number;
    discountedPrice: number;
    discountPercent: number;
    images: Array<{ url: string }>;
    stock: number;
  }) => api.post("/api/cart/add", data),

  updateCartItem: (productId: string, quantity: number) =>
    api.put(`/api/cart/items/${productId}`, { quantity }),

  removeFromCart: (productId: string) =>
    api.delete(`/api/cart/items/${productId}`),

  clearCart: () => api.delete("/api/cart/clear"),
};

// Order API endpoints
export const orderAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get("/api/orders", { params }),

  getAllAdmin: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => api.get("/api/orders/admin/all", { params }),

  getById: (id: string) => api.get(`/api/orders/${id}`),

  create: (data: {
    shippingAddress: string;
    township: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryDate: string;
    paymentType: "cod" | "bank_transfer" | "credit_card" | "e_wallet" | "qris";
    deliveryType: "standard" | "express";
    totalPrice: number;
    products: Array<{ productId: string; quantity: number }>;
  }) => api.post("/api/orders", data),

  updateStatus: (
    id: string,
    status:
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "paid"
      | "unpaid"
  ) => api.put(`/api/orders/${id}/status`, { status }),

  checkPaymentStatus: (orderId: string) =>
    api.get(`/api/orders/payment/status/${orderId}`),

  getQRISCode: (orderId: string) =>
    api.get(`/api/orders/payment/qris/${orderId}`),
};

// Blog API endpoints
export const blogAPI = {
  // Admin endpoints
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    tags?: string;
  }) => api.get("/api/blogs", { params }),

  getById: (id: string) => api.get(`/api/blogs/${id}`),

  create: (data: {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: { url: string; publicId?: string };
    status?: "draft" | "published";
    tags?: string[];
    category?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  }) => api.post("/api/blogs", data),

  update: (
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      featuredImage?: { url: string; publicId?: string };
      status?: "draft" | "published";
      tags?: string[];
      category?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string[];
    }
  ) => api.put(`/api/blogs/${id}`, data),

  delete: (id: string) => api.delete(`/api/blogs/${id}`),

  getStats: () => api.get("/api/blogs/stats"),

  // Public endpoints
  getPublished: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tags?: string;
  }) => api.get("/api/blogs/public", { params }),

  getBySlug: (slug: string) => api.get(`/api/blogs/public/${slug}`),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/api/upload/blog", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Reports API endpoints
export const reportAPI = {
  getSalesAnalytics: (period?: number) =>
    api.get("/api/reports/sales", { params: { period } }),

  getUserAnalytics: (period?: number) =>
    api.get("/api/reports/users", { params: { period } }),

  getProductAnalytics: (period?: number) =>
    api.get("/api/reports/products", { params: { period } }),

  getOrderAnalytics: (period?: number) =>
    api.get("/api/reports/orders", { params: { period } }),

  getDashboardOverview: () => api.get("/api/reports/overview"),
};

export const reviewAPI = {
  getByProduct: (productId: string) =>
    api.get(`/api/products/${productId}/reviews`),
  add: (productId: string, data: { rating: number; comment: string }) =>
    api.post(`/api/products/${productId}/reviews`, data),
  delete: (productId: string, reviewId: string) =>
    api.delete(`/api/products/${productId}/reviews/${reviewId}`),
  checkEligibility: (productId: string) =>
    api.get(`/api/products/${productId}/review-eligibility`),
};

// Promotional Carousel API endpoints
export const promotionalCarouselAPI = {
  // Admin endpoints
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get("/api/promotional-carousel", { params }),

  getById: (id: string) => api.get(`/api/promotional-carousel/${id}`),

  create: (data: {
    title: string;
    subtitle: string;
    description: string;
    date?: string;
    image: { url: string; publicId?: string };
    buttonText: string;
    backgroundColor: string;
    textColor: string;
    status?: "active" | "inactive";
    order?: number;
    linkUrl?: string;
    startDate?: string;
    endDate?: string;
  }) => api.post("/api/promotional-carousel", data),

  update: (
    id: string,
    data: {
      title?: string;
      subtitle?: string;
      description?: string;
      date?: string;
      image?: { url: string; publicId?: string };
      buttonText?: string;
      backgroundColor?: string;
      textColor?: string;
      status?: "active" | "inactive";
      order?: number;
      linkUrl?: string;
      startDate?: string;
      endDate?: string;
    }
  ) => api.put(`/api/promotional-carousel/${id}`, data),

  delete: (id: string) => api.delete(`/api/promotional-carousel/${id}`),

  updateOrder: (slides: Array<{ id: string; order: number }>) =>
    api.put("/api/promotional-carousel/order", { slides }),

  // Public endpoints
  getActive: () => api.get("/api/promotional-carousel/public"),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/api/upload/promotional-carousel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
