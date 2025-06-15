// Import mock data as fallback
import { mockProducts } from "./mockData";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Demo mode management
let demoMode = true; // Start in demo mode by default
let backendCheckAttempted = false;

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Function to check if we should use demo mode
const shouldUseDemoMode = (): boolean => {
  return demoMode;
};

// Function to enable backend mode (when user explicitly wants to try)
export const enableBackendMode = () => {
  demoMode = false;
  backendCheckAttempted = false;
};

// Function to force demo mode
export const enableDemoMode = () => {
  demoMode = true;
};

// Helper to make authenticated requests (only when not in demo mode)
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  // If in demo mode, immediately throw a network error
  if (shouldUseDemoMode()) {
    throw new ApiError(0, "Demo mode - backend not available");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new ApiError(
        response.status,
        errorData.message || "Request failed",
      );
    }

    // If we get here, backend is working - stay in backend mode
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // On any network error, switch back to demo mode
    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("ERR_NETWORK") ||
        error.message.includes("ECONNREFUSED"))
    ) {
      demoMode = true; // Switch back to demo mode
      throw new ApiError(0, "Backend server is not available");
    }

    throw new ApiError(0, "Network error occurred");
  }
};

// Authentication API
export const authApi = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    return makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return makeRequest("/auth/me");
  },

  updateProfile: async (profileData: {
    name?: string;
    phone?: string;
    address?: any;
  }) => {
    return makeRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return makeRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  },
};

// Products API with demo mode fallbacks
export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    // Always return mock data in demo mode
    if (shouldUseDemoMode()) {
      let filteredProducts = [...mockProducts];

      // Apply filtering if needed
      if (params?.category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === params.category,
        );
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search),
        );
      }

      return { products: filteredProducts };
    }

    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
      return await makeRequest(`/products${query}`);
    } catch (error: any) {
      if (error.status === 0) {
        // Backend not available, use mock data
        let filteredProducts = [...mockProducts];

        // Apply filtering if needed
        if (params?.category) {
          filteredProducts = filteredProducts.filter(
            (p) => p.category === params.category,
          );
        }
        if (params?.search) {
          const search = params.search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.title.toLowerCase().includes(search) ||
              p.description.toLowerCase().includes(search),
          );
        }

        return { products: filteredProducts };
      }
      throw error;
    }
  },

  getById: async (id: string) => {
    // Always return mock data in demo mode
    if (shouldUseDemoMode()) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }
      return product;
    }

    try {
      return await makeRequest(`/products/${id}`);
    } catch (error: any) {
      if (error.status === 0) {
        // Backend not available, use mock data
        const product = mockProducts.find((p) => p.id === id);
        if (!product) {
          throw new ApiError(404, "Product not found");
        }
        return product;
      }
      throw error;
    }
  },

  getCategories: async () => {
    // Always return mock data in demo mode
    if (shouldUseDemoMode()) {
      const categories = [...new Set(mockProducts.map((p) => p.category))];
      return categories;
    }

    try {
      return await makeRequest("/products/data/categories");
    } catch (error: any) {
      if (error.status === 0) {
        // Backend not available, use mock data
        const categories = [...new Set(mockProducts.map((p) => p.category))];
        return categories;
      }
      throw error;
    }
  },

  create: async (productData: any) => {
    return makeRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: any) => {
    return makeRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: string) => {
    return makeRequest(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Cart API (demo mode returns empty cart)
export const cartApi = {
  get: async () => {
    if (shouldUseDemoMode()) {
      return {
        user: null,
        items: [],
        totalAmount: 0,
      };
    }
    return makeRequest("/cart");
  },

  add: async (productId: string, quantity: number = 1) => {
    if (shouldUseDemoMode()) {
      throw new ApiError(
        0,
        "Please enable backend mode to use cart functionality",
      );
    }
    return makeRequest("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  update: async (productId: string, quantity: number) => {
    if (shouldUseDemoMode()) {
      throw new ApiError(
        0,
        "Please enable backend mode to use cart functionality",
      );
    }
    return makeRequest(`/cart/update/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (productId: string) => {
    if (shouldUseDemoMode()) {
      throw new ApiError(
        0,
        "Please enable backend mode to use cart functionality",
      );
    }
    return makeRequest(`/cart/remove/${productId}`, {
      method: "DELETE",
    });
  },

  clear: async () => {
    if (shouldUseDemoMode()) {
      throw new ApiError(
        0,
        "Please enable backend mode to use cart functionality",
      );
    }
    return makeRequest("/cart/clear", {
      method: "DELETE",
    });
  },

  getCount: async () => {
    if (shouldUseDemoMode()) {
      return { itemCount: 0 };
    }
    return makeRequest("/cart/count");
  },
};

// Orders API (demo mode returns empty orders)
export const ordersApi = {
  create: async (orderData: {
    shippingAddress: any;
    paymentInfo: any;
    notes?: string;
  }) => {
    return makeRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    if (shouldUseDemoMode()) {
      return {
        orders: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalOrders: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return makeRequest(`/orders/my-orders${query}`);
  },

  getById: async (id: string) => {
    return makeRequest(`/orders/${id}`);
  },

  cancel: async (id: string) => {
    return makeRequest(`/orders/${id}/cancel`, {
      method: "PUT",
    });
  },
};

// Payment API
export const paymentApi = {
  createIntent: async (amount: number, currency: string = "usd") => {
    return makeRequest("/payment/create-intent", {
      method: "POST",
      body: JSON.stringify({ amount, currency }),
    });
  },

  confirmPayment: async (paymentData: {
    paymentIntentId: string;
    shippingAddress: any;
    notes?: string;
  }) => {
    return makeRequest("/payment/confirm", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  getPaymentIntent: async (paymentIntentId: string) => {
    return makeRequest(`/payment/intent/${paymentIntentId}`);
  },
};

// Admin API
export const adminApi = {
  getDashboard: async () => {
    return makeRequest("/admin/dashboard");
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return makeRequest(`/admin/users${query}`);
  },

  updateUserStatus: async (userId: string, isActive: boolean) => {
    return makeRequest(`/admin/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
  },

  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    includeInactive?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return makeRequest(`/admin/products${query}`);
  },

  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return makeRequest(`/admin/all${query}`);
  },

  updateOrderStatus: async (
    orderId: string,
    status: string,
    trackingNumber?: string,
  ) => {
    return makeRequest(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, trackingNumber }),
    });
  },

  createAdmin: async (adminData: {
    name: string;
    email: string;
    password: string;
  }) => {
    return makeRequest("/admin/create-admin", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  },
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new ApiError(response.status, errorData.message);
    }

    return await response.json();
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new ApiError(response.status, errorData.message);
    }

    return await response.json();
  },

  deleteFile: async (filename: string) => {
    return makeRequest(`/upload/${filename}`, {
      method: "DELETE",
    });
  },

  getFilesList: async () => {
    return makeRequest("/upload/list");
  },
};

// Contact API
export const contactApi = {
  submit: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    return makeRequest("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    });
  },
};

// Export demo mode status check
export const isDemoMode = () => demoMode;

export { ApiError };
