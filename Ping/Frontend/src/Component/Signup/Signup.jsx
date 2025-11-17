import React, { useState, useContext } from "react";
import "./Signup.css";
import { registerUser, sendOtp, verifyOtp, sendWelcomeEmail } from "../../Api/auth.js";
import { StoreContext } from "../../StoreContext/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingMessage from "../LoadingMessage/LoadingMessage";

const Signup = () => {
  const { login, setLogin, loading, setLoading } = useContext(StoreContext);
  const [step, setStep] = useState(1); // 1 = Email, 2 = Verify OTP, 3 = Signup Form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(file);
  };

  // ✅ Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.warn("Please enter your email!", { theme: "dark" });
      return;
    }
    try {
      setLoading(true);
      const response = await sendOtp(email);
      toast.success(response.message || "OTP sent successfully!", { theme: "dark" });
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP. Try again!", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warn("Please enter the OTP!", { theme: "dark" });
      return;
    }
    try {
      setLoading(true);
      const response = await verifyOtp(email, otp);
      toast.success(response.message || "OTP verified successfully!", { theme: "dark" });
      setStep(3);
    } catch (err) {
      toast.error("Invalid or expired OTP!", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 3: Register User
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== conPassword) {
      toast.warn("Passwords do not match!", { theme: "dark" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      const response = await registerUser(formData);
      toast.success(response.message || "Signup successful!", { theme: "dark" });
      await sendWelcomeEmail(email);

      // 👇 After successful signup, go to login
      navigate("/login");
    } catch (err) {
      toast.error("Signup failed! Try again.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {loading ? (
        <LoadingMessage />
      ) : (
        <div className="signup-card">
          {step === 1 && (
            <>
              <h2>Email Verification</h2>
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
            </>
          )}

          {step === 2 && (
            <>
              <h2>Verify OTP</h2>
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
            </>
          )}

          {step === 3 && (
            <>
              <h2>Create Account</h2>
              <form onSubmit={handleSignup} encType="multipart/form-data">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password"
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

                <div className="input-group file-input">
                  <label htmlFor="avatar">Choose Avatar:</label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Create Account
                </button>
              </form>
            </>
          )}
          <p className="signup-footer">
            Already have an account?{" "}
            <span onClick={() => setLogin(!login)}>Login</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Signup;
