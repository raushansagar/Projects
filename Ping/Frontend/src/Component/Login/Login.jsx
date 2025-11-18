import React, { useState, useContext } from "react";
import "./Login.css";
import { loginUser } from "../../Api/auth";
import { StoreContext } from "../../StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingMessage from "../LoadingMessage/LoadingMessage";
import loginlogo from '../../assets/loginlogo.png'

const Login = () => {
  const { login, setLogin, loading, setLoading } = useContext(StoreContext);
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.warn("Please fill in all fields!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    try {
      setLoading(true);
      const userData = await loginUser(identifier, password);

      toast.success(userData.message || "Login successful!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });

      navigate("/chat");
    } catch (err) {
      // console.error("Login error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Invalid username or password!",
        {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        }
      );
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-container">
      {loading ? (
        <LoadingMessage />
      ) : (
        <div className="Login-card">
          <p className="Login-logo">
            <ion-icon name="logo-gitlab"></ion-icon>
          </p>

          <div className="Login-form">
            <form onSubmit={handleLogin}>
              <div className="Login-input">
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="Login-input">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="Login-btn">
                Login
              </button>
            </form>
          </div>

          <p className="Login-footer">
            <span className="sp1" onClick={() => navigate("/ForgotPassword")}>Forgot Password?</span>
            <span className="sp2" onClick={() => setLogin(!login)}>Create Account</span>
            
          </p>

          <div className="Login-icons">
            <ion-icon name="logo-facebook"></ion-icon>
            <ion-icon name="logo-google"></ion-icon>
            <ion-icon name="logo-linkedin"></ion-icon>
            <ion-icon name="logo-github"></ion-icon>
          </div>
        </div>
      )}
      <img className="loginlogo" src={loginlogo} alt="logo" />
    </div>
  );
};

export default Login;
