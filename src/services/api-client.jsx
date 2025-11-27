// src/services/api-client.jsx
// 🔥 NEW FILE: Centralized API client with JWT token management

import axios from "axios";
import keycloak from "../keycloak";

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000, // 60 seconds
});
let requestCounter = 0;

apiClient.interceptors.request.use(
    (config) => {
        requestCounter++;
        console.log(`📤 API Request #${requestCounter}:`, config.method?.toUpperCase(), config.url);

        const token = keycloak.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response:`, response.config.url, response.status);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.error(`❌ API Error:`, originalRequest?.url, error.response?.status);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            console.log("🔄 Attempting token refresh...");

            try {
                const refreshed = await keycloak.updateToken(30);

                if (refreshed) {
                    console.log("✅ Token refreshed successfully");
                    originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("❌ Token refresh failed:", refreshError);
                keycloak.login();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
