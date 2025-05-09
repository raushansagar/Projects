import React, { useContext, useState } from 'react'
import './LoginSignUp.css';
import axios from "../../axios.js";
import { StoreContext } from '../../StoreContext/StoreContext.jsx';
import { toast } from 'react-toastify';



const LoginSignUp = () => {

  const [user, setUser] = useState("Login");
  const { setToken, setLoginPopUp, url } = useContext(StoreContext);

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();


    try {

      if (user === "Login") {

        // User Login 
        const response = await axios.post("/login", { email, password });

        if (response.status === 200) {
          localStorage.setItem("token", response.data.data.accessToken);
          setToken(response.data.data.accessToken);
          toast.success("Login successfully!");
          setLoginPopUp(true);
        }
      }
      else {

        // Register User
        const response = await axios.post("/register", { fullName, userName, email, password });

        if (response.status === 200) {
          setUser("Login")
          toast.success("Account create successfully!");
        }
      }

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message || "Something went wrong";

    
        if (status === 400) {
          toast.warn("All fields are required");
        } 
        else if (status === 401) {
          toast.warn("Email or Username already exists");
        } 
        else if(status === 402){
          toast.warn("Invalid email");
        }
        else if (status === 403) {
          toast.warn("Password not match");
        } 
        else if (status === 500) {
          toast.warn("Server Error. Please try again later.");
        } 
        else {
          toast.error(backendMessage);
        }
      } else {

        // Network or unexpected error
        toast.error("Network error or unexpected issue occurred");
      }
    }
  };

  return (
    <div className='container'>
      <div className="login-container">
        <div className="login-header">
          <ion-icon name="logo-octocat"></ion-icon>
          {user === "Login" ? <><h3>Welcome!</h3>
            <p>Sign in to your account</p></> :
            <h3>Create Account!</h3>
          }
        </div>
        <form onSubmit={handleLogin}>
          <div className="login-input">
            {user === "Login" ? "" :
              <label>Full Name<input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} required /><ion-icon name="person"></ion-icon></label>
            }
            <label>Email<input type="email" value={email} placeholder='' onChange={(e) => setEmail(e.target.value)} /><ion-icon name="mail"></ion-icon></label>
            <label>Password<input type="password" placeholder='' value={password} onChange={(e) => setPassword(e.target.value)} required /><ion-icon name="lock-closed"></ion-icon></label>
          </div>
          {user === "Login" ? <div className='login-forgot'>
            <label><input type="checkbox" /> remember me? </label>
            <p>Forgot password?</p>
          </div> :
            <></>}
          <div className='action-btn'>
            <button className='btn'>{user === "Login" ? "Login" : "Create"} <ion-icon name="arrow-forward-outline"></ion-icon></button>
            <p onClick={() => setUser(user == "Login" ? "Register" : "Login")}>{user === "Login" ? "Don't have an account? Register" : "Already have account? Login"}</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginSignUp;
