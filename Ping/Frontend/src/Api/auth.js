import api from "./api";
import { toast } from "react-toastify";

// ======================= AUTH =======================

// Login User
const loginUser = async (identifier, password) => {
  try {
    const response = await api.post(
      "/login",
      { username: identifier, email: identifier, password },
      { withCredentials: true }
    );
    const { accessToken, user, message } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return { accessToken, user, message };
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Login failed";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// Register User
const registerUser = async (formData) => {
  try {
    const response = await api.post("/register", formData, {
      withCredentials: true,
    });
    const { accessToken, user, message } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return { accessToken, user, message };
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Registration failed";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// Helper: get Authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
};

// ======================= FETCH USER =======================

const fetchUser = async () => {
  const headers = getAuthHeaders();
  if (!headers) return null;

  try {
    const response = await api.post(
      "/fetchUser",
      {},
      {
        headers,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) return fetchUser();
    }
    throw err;
  }
};

const fetchAllUser = async () => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.post(
      "/fetchAllUser",
      {},
      {
        headers,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) return fetchAllUser();
    }
    throw err;
  }
};

// Refresh Access Token
const refreshAccessToken = async () => {
  try {
    const response = await api.post("/refreshToken", {}, { withCredentials: true });
    const { accessToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (err) {
    localStorage.removeItem("accessToken");
    return null;
  }
};

// Logout User
const logoutUser = async () => {
  try {
    await api.post("/logout", {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout Error:", err.response?.data || err.message);
  } finally {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }
};

// ======================= FRIENDS =======================

const sendFriendRequest = async (receiverId) => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.post(
      "/friends/request",
      { receiverId },
      { headers, withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to send friend request";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

const acceptFriendRequest = async (requestId) => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.post(
      "/friends/accept",
      { requestId },
      { headers, withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to accept friend request";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

const declineFriendRequest = async (requestId) => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.post(
      "/friends/decline",
      { requestId },
      { headers, withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to decline friend request";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

const getPendingRequests = async () => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.get("/friends/requests", {
      headers,
      withCredentials: true,
    });
    return response.data.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to fetch pending requests";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

const getFriends = async () => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.get("/friends", {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to fetch friends list";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// ======================= MESSAGES =======================

// send user message
const sendMessage = async (senderId, text) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await api.post(
      "/send/messages",
      { senderId, text },
      {
        headers: { ...headers, "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to send message";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// get messages
const getMessages = async (senderId) => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const response = await api.get(`/messages/${senderId}`, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to fetch messages";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// ======================= OTP & PASSWORD =======================

// send OTP
const sendOtp = async (email) => {
  try {
    const response = await api.post(
      "/send/otp",
      { email },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to send otp";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// Verify OTP
const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post(
      "/verify/otp",
      { email, otp },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to verify Otp";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// Reset Password
const ResetPassword = async (email, password) => {
  try {
    const response = await api.post(
      "/ResetPassword",
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to Reset Password";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

// Send Welcome Email
const sendWelcomeEmail = async (email) => {
  try {
    const response = await api.post(
      "/sendWelcomeEmail",
      { email },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to send Welcome Email";
    toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "colored" });
    throw err;
  }
};

export {
  loginUser,
  registerUser,
  fetchUser,
  logoutUser,
  fetchAllUser,
  refreshAccessToken,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getPendingRequests,
  getFriends,
  sendMessage,
  getMessages,
  sendOtp,
  verifyOtp,
  ResetPassword,
  sendWelcomeEmail,
};
