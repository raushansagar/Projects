import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import "./App.css";

import Chat from "./Component/Chat/Chat";
import Footer from "./Component/Footer/Footer";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword.jsx";
import LoginSignup from "./Component/LoginSignup/LoginSignup.jsx";
import Profile from "./Component/Profile/Profile.jsx";

import { StoreContext } from "./StoreContext/StoreContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Call UI Components
import IncomingCallPopup from "./Component/IncomingCallPopup/IncomingCallPopup.jsx";
import VideoCall from "./Component/VideoCall/VideoCall.jsx";

// Socket
import { useSocket } from "./Providers/Socket.jsx";

function App() {
  const { user } = useContext(StoreContext);
  const isLoggedIn = !!localStorage.getItem("accessToken") || !!user;

  // calling states from socket context
  const {
    callActive,
    incomingCall,
    acceptCall,
    rejectCall,
    endCall,
    localStream,
  } = useSocket();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* 🔔 Incoming Call Popup */}
      {isLoggedIn && incomingCall && (
        <IncomingCallPopup
          callData={incomingCall}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* 🎥 Show Video UI whenever:
            - callActive is true OR
            - YOU started a call → localStream is available 
      */}
      {isLoggedIn && (callActive || localStream) && (
        <VideoCall onClose={endCall} />
      )}

      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/chat" /> : <LoginSignup />}
        />

        {/* Forgot Password */}
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        {/* Chat Route (Protected) */}
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route path="/user/profile" element={<Profile/>} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {!isLoggedIn && <Footer />}
    </>
  );
}

export default App;
