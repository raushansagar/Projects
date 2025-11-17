import React, { useState, useContext } from "react";
import './ForgotPassword.css';
import { sendOtp, verifyOtp, ResetPassword } from "../../Api/auth.js";
import { StoreContext } from "../../StoreContext/StoreContext";
import { toast } from "react-toastify";
import LoadingMessage from "../LoadingMessage/LoadingMessage";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { loading, setLoading } = useContext(StoreContext);
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const navigate = useNavigate();


  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.warn("Please enter your email!", { theme: "dark" });
      return;
    }
    try {
      setLoading(true);
      const response = await sendOtp(email);
      toast.success(response.message || "OTP sent to your email!", {
        theme: "dark",
      });
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP! Try again.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };


  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warn("Please enter OTP!", { theme: "dark" });
      return;
    }
    try {
      setLoading(true);
      const response = await verifyOtp(email, otp);
      toast.success(response.message || "OTP verified successfully!", {
        theme: "dark",
      });
      setStep(3);
    } catch (err) {
      toast.error("Invalid or expired OTP!", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== conPassword) {
      toast.warn("Passwords do not match!", { theme: "dark" });
      return;
    }

    try {
      setLoading(true);
      const response = await ResetPassword(email, password);
      toast.success(response.message || "Password reset successful!", {
        theme: "dark",
      });
      navigate("/login");
    } catch (err) {
      toast.error("User not found with this email!", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container"> 
      {loading ? (
        <LoadingMessage />
      ) : (
        <div className="forgot-password-card"> 
          {step === 1 && (
            <>
              <h2>Forgot Password</h2>
              <p>Enter your email to receive an OTP</p>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="submit-btn" onClick={handleSendOtp}>
                Send OTP
              </button>
              <p className="forgot-password-footer"> {/* ✅ Updated class */}
                Remember your password?{" "}
                <span onClick={() => navigate("/login")}>Login</span>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Verify OTP</h2>
              <p>Check your inbox for the OTP.</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button className="submit-btn" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
              <button className="resend-btn" onClick={handleSendOtp}>
                Resend OTP
              </button>
              <p className="forgot-password-footer"> {/* ✅ Updated class */}
                Remember your password?{" "}
                <span onClick={() => navigate("/login")}>Login</span>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Reset Password</h2>
              <form onSubmit={handleResetPassword}>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={conPassword}
                    onChange={(e) => setConPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Reset Password
                </button>
              </form>
              <p className="forgot-password-footer"> {/* ✅ Updated class */}
                Remember your passwords?{" "}
                <span onClick={() => navigate("/")}>Login</span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;