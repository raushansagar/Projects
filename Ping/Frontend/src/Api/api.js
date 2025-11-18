// api.js
import axios from "axios";
import { logoutUser } from "./auth.js";

const url = import.meta.env.VITE_API_URL3;

// Create Axios instance
const api = axios.create({
    baseURL: url,
    withCredentials: true, // send cookies (refresh token)
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
    if (!config.url.includes("/refreshToken")) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/refreshToken")) {
            if (isRefreshing) {
                // Queue failed requests while refreshing
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh token endpoint
                const refreshResponse = await api.post("/refreshToken", {}, { withCredentials: true });

                const accessToken = refreshResponse.data.accessToken || refreshResponse.data?.data?.accessToken;

                if (!accessToken) {
                    throw new Error("No access token returned from refresh endpoint");
                }

                localStorage.setItem("accessToken", accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return api(originalRequest);

            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem("accessToken");
                logoutUser();
                alert("Session expired. Please login again.");
                window.location.href = "/login"; // or use router navigation
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
