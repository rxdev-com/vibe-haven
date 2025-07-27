const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Auth token management
export const authToken = {
  get: () => localStorage.getItem("auth_token"),
  set: (token: string) => localStorage.setItem("auth_token", token),
  remove: () => localStorage.removeItem("auth_token"),
};

// User data management
export const userData = {
  get: () => {
    const user = localStorage.getItem("user_data");
    return user ? JSON.parse(user) : null;
  },
  set: (user: any) => localStorage.setItem("user_data", JSON.stringify(user)),
  remove: () => localStorage.removeItem("user_data"),
};

// API request wrapper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = authToken.get();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Check if it's a database unavailable error
      if (response.status === 503 && data.error === "Database not available") {
        const dbError = new Error(
          "Database features not available in development mode",
        );
        (dbError as any).isDatabaseError = true;
        throw dbError;
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "vendor" | "supplier";
    businessName: string;
    address: string;
    description?: string;
    specialties?: string[];
    categories?: string[];
    deliveryAreas?: string[];
    businessType?: string;
    license?: string;
    location?: { coordinates: [number, number] };
  }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials: {
    email: string;
    password: string;
    role: "vendor" | "supplier";
  }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest("/auth/me"),

  updateProfile: (updates: any) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
};

// Materials API
export const materialsAPI = {
  getAll: (
    params: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      page?: number;
      limit?: number;
      inStock?: boolean;
      supplierId?: string;
      userLat?: number;
      userLon?: number;
      maxDistance?: number;
    } = {},
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return apiRequest(`/materials?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest(`/materials/${id}`),

  create: (materialData: {
    name: string;
    category: string;
    price: number;
    unit: string;
    stock: number;
    description?: string;
    image?: string;
    images?: string[];
    tags?: string[];
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    nutritionalInfo?: any;
    storageInstructions?: string;
    shelfLife?: string;
    origin?: string;
    certifications?: string[];
  }) =>
    apiRequest("/materials", {
      method: "POST",
      body: JSON.stringify(materialData),
    }),

  update: (id: string, updates: any) =>
    apiRequest(`/materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (id: string) =>
    apiRequest(`/materials/${id}`, {
      method: "DELETE",
    }),

  getBySupplier: (supplierId: string, params: any = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return apiRequest(
      `/materials/supplier/${supplierId}?${searchParams.toString()}`,
    );
  },
};

// Orders API
export const ordersAPI = {
  getAll: (
    params: {
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return apiRequest(`/orders?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest(`/orders/${id}`),

  create: (orderData: {
    items: Array<{
      materialId: string;
      quantity: number;
    }>;
    deliveryAddress: string;
    deliveryInstructions?: string;
    paymentMethod?: "cash" | "card" | "upi" | "wallet";
  }) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  updateStatus: (id: string, status: string, supplierNotes?: string) =>
    apiRequest(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, supplierNotes }),
    }),

  cancel: (id: string, cancellationReason?: string) =>
    apiRequest(`/orders/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ cancellationReason }),
    }),

  rate: (
    id: string,
    rating: {
      overall: number;
      quality: number;
      delivery: number;
      service: number;
      comment?: string;
    },
  ) =>
    apiRequest(`/orders/${id}/rate`, {
      method: "PUT",
      body: JSON.stringify(rating),
    }),
};

// Health check
export const healthAPI = {
  ping: () => apiRequest("/ping"),
};

export default {
  auth: authAPI,
  materials: materialsAPI,
  orders: ordersAPI,
  health: healthAPI,
};
