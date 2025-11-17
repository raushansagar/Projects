import { emit } from "process";
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
    // toast.error(errorMsg, { position: "top-right", autoClose: 2000, theme: "colored" });
    console.error("Login Error:", err.response?.data || err.message);
    //window.location.href = "/login"; 
    //throw err.response?.data || { message: err.message || "Login failed" };
  }
};

// Register User
const registerUser = async (formData) => {
  try {
    const response = await api.post("/register", formData, {
      withCredentials: true,
      // DO NOT set Content-Type; let axios handle it
    });

    const { accessToken, user, message } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return { accessToken, user, message };
  } catch (err) {
    console.error("Register Error:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message || "Registration failed" };
  }
};


// ======================= FETCH USER =======================

// Fetch Logged-in User (if token exists)
const fetchUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const response = await api.post(
      "/fetchUser",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
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

// Fetch All Users (if token exists)
const fetchAllUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  try {
    const response = await api.post(
      "/fetchAllUser",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
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
    // console.error("Refresh token failed", err.response?.data || err.message);
    localStorage.removeItem("accessToken");
    return null;
  }
};

// Logout User
const logoutUser = async () => {
  try {
    await api.post("/logout", {}, { withCredentials: true });
    localStorage.removeItem("accessToken");
    window.location.href = "/login"; 
  } catch (err) {
    console.error("Logout Error:", err.response?.data || err.message);
  }
};

// ======================= FRIENDS =======================

const sendFriendRequest = async (receiverId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  try {
    const response = await api.post("/friends/request", { receiverId });
    return response.data;
  } catch (err) {
    console.error("Send Friend Request Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to send friend request" };
  }
};

const acceptFriendRequest = async (requestId) => {

  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  try {
    const response = await api.post("/friends/accept", { requestId });
    console.log(response);
    return response.data;
  } catch (err) {
    console.error("Accept Friend Request Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to accept friend request" };
  }
};

const declineFriendRequest = async (requestId) => {

  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  try {
    const response = await api.post("/friends/decline", { requestId });
    return response.data;
  } catch (err) {
    console.error("Decline Friend Request Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to decline friend request" };
  }
};

const getPendingRequests = async () => {

  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  try {
    const response = await api.get("/friends/requests");
    return response.data.data;
  } catch (err) {
    console.error("Get Pending Requests Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to fetch pending requests" };
  }
};

const getFriends = async () => {
  try {
    const response = await api.get("/friends");
    return response.data;
  } catch (err) {
    console.error("Get Friends Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to fetch friends list" };
  }
};


// ======================= MESSAGES =======================


// send user message
const sendMessage = async (senderId, text) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    try {
      const response = await api.post(
        "/send/messages",
        { senderId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Message Sent Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Send Message Error:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to send message" };
    }
  }
};




//  get message  
const getMessages = async (senderId) => {

  const token = localStorage.getItem("accessToken");

  if (token) {
    try {
      const response = await api.get(`/messages/${senderId}`);
      return response.data;
    } catch (err) {
      console.error("Get Messages Error:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch messages" };
    }
  }
};



//  sendOtp  verifyOtp

// send OTP
const sendOtp = async (email) => {

  console.log(email);
  
  try {
    const response = await api.post(
      "/send/otp",
      { email },
      { withCredentials: true }
    );

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Send OTP Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to send otp" };
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

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Verify Otp Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to verify Otp" };
  }
}


// ResetPassword
const ResetPassword = async (email, password) => {
  try {
    const response = await api.post(
      "/ResetPassword",
      { email, password },
      { withCredentials: true }
    );

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("ResetPassword Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to ResetPassword" };
  }
}


// sendWelcomeEmail
const sendWelcomeEmail = async (email) => {
  try {
    const response = await api.post(
      "/sendWelcomeEmail",
      { email },
      { withCredentials: true }
    );

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("sendWelcomeEmail Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to sendWelcomeEmail" };
  }
}


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
  sendWelcomeEmail
};
