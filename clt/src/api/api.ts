import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err.response?.data?.error || err.message);
  },
);

export const productApi = {
  list: (params = {}) =>
    api.get("/api/products", { params }).then((r) => {
      const d = r.data as unknown as Record<string, unknown>;
      if (d && typeof d === "object" && (d["Data"] || d["data"])) {
        return {
          data: (d["Data"] as unknown) ?? (d["data"] as unknown),
          total:
            (d["Total"] as unknown as number) ??
            (d["total"] as unknown as number) ??
            0,
          page:
            (d["Page"] as unknown as number) ??
            (d["page"] as unknown as number) ??
            1,
          limit:
            (d["Limit"] as unknown as number) ??
            (d["limit"] as unknown as number) ??
            10,
          totalPages:
            (d["TotalPages"] as unknown as number) ??
            (d["totalPages"] as unknown as number) ??
            1,
        };
      }
      return r.data;
    }),
  get: (id: number) => api.get(`/api/products/${id}`).then((r) => r.data),
  create: (data: object) => api.post("/api/products", data).then((r) => r.data),
  update: (id: number, data: object) =>
    api.put(`/api/products/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/api/products/${id}`).then((r) => r.data),
  stats: () => api.get("/api/products/stats").then((r) => r.data),
  categories: () => api.get("/api/products/categories").then((r) => r.data),
};

export const userApi = {
  list: (params = {}) =>
    api.get("/api/users", { params }).then((r) => {
      // Server returns PascalCase PaginatedResponse: { Data, Total, Page, Limit, TotalPages }
      const d = r.data as unknown as Record<string, unknown>;
      if (d && typeof d === "object" && (d["Data"] || d["data"])) {
        return {
          data: (d["Data"] as unknown) ?? (d["data"] as unknown),
          total:
            (d["Total"] as unknown as number) ??
            (d["total"] as unknown as number) ??
            0,
          page:
            (d["Page"] as unknown as number) ??
            (d["page"] as unknown as number) ??
            1,
          limit:
            (d["Limit"] as unknown as number) ??
            (d["limit"] as unknown as number) ??
            10,
          totalPages:
            (d["TotalPages"] as unknown as number) ??
            (d["totalPages"] as unknown as number) ??
            1,
        };
      }
      return r.data;
    }),
  get: (id: number) =>
    api.get(`/api/users/${id}`).then((r) => {
      const d = r.data as unknown as Record<string, unknown>;
      if (!d) return r.data;
      return {
        id: (d["Id"] as unknown as number) ?? (d["id"] as unknown as number),
        email: (d["Email"] as unknown as string) ?? (d["email"] as unknown as string),
        firstName:
          (d["FirstName"] as unknown as string) ?? (d["firstName"] as unknown as string) ?? null,
        lastName:
          (d["LastName"] as unknown as string) ?? (d["lastName"] as unknown as string) ?? null,
        phone: (d["Phone"] as unknown as string) ?? (d["phone"] as unknown as string) ?? null,
        roles:
          (d["Roles"] as unknown as string[]) ?? (d["roles"] as unknown as string[]) ?? [],
        active:
          (d["Active"] as unknown as boolean) ?? (d["active"] as unknown as boolean) ?? false,
        createdAt:
          (d["CreatedAt"] as unknown as string) ?? (d["createdAt"] as unknown as string) ?? undefined,
      };
    }),
  create: (data: object) => api.post("/api/users", data).then((r) => r.data),
  update: (id: number, data: object) =>
    api.put(`/api/users/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/api/users/${id}`).then((r) => r.data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }).then((r) => r.data),
  register: (data: object) => api.post("/api/users", data).then((r) => r.data),
};

export const dashboardApi = {
  stats: () => api.get("/api/dashboard").then((r) => r.data),
};

export default api;
