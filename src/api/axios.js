import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "X-App-Client": "kce-admin",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error response exists and is a 401
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const { data } = error.response;

      // Only attempt refresh if it's the specific "not authorized" message
      // and not already trying to refresh or on login page
      if (
        (data && data.message === "Not authorized, please login") ||
        error.response.status === 401
      ) {
        if (window.location.pathname === "/login") {
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            // Determine if it's staff or user based on roles or stored info
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const staffRoles = ["admin", "instructor"];
            const isStaff = staffRoles.includes(user.role);
            
            const refreshEndpoint = isStaff 
              ? "/auth/staff-refresh-token" 
              : "/auth/refresh-token";

            console.log(`[Token Refresh] Attempting refresh for ${isStaff ? 'Staff' : 'User'} (${user.role}) at ${refreshEndpoint}`);

            // We use a clean axios instance to avoid interceptor recursion
            const refreshInstance = axios.create({
              baseURL: import.meta.env.VITE_API_BASE_URL,
              headers: {
                "X-App-Client": "kce-admin",
                "Content-Type": "application/json",
              }
            });

            const response = await refreshInstance.post(refreshEndpoint, { refreshToken });

            if (response.data.status === "success" || response.data.success) {
              const newToken = response.data.token;
              const newRefreshToken = response.data.refreshToken;

              console.log("[Token Refresh] Success. Updating tokens.");
              localStorage.setItem("token", newToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            } else {
              throw new Error("Refresh response did not indicate success");
            }
          } catch (refreshError) {
            console.error("[Token Refresh] Failed:", refreshError.response?.data || refreshError.message);
            // Refresh failed, logout
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login?sessionExpired=true";
          }
        } else {
          console.warn("[Token Refresh] No refresh token found in storage.");
          // No refresh token, logout
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login?sessionExpired=true";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
