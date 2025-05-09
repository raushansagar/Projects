import React, { useContext, useState } from 'react'
import './LoginSignUp.css';
import axios from "../../axios.js";
import { StoreContext } from '../../StoreContext/StoreContext.jsx';
import { Link } from 'react-router-dom';
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

    if (user === "Login") {

      // Login User 
  
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.accessToken);
        setToken(response.data.data.accessToken);
        setLoginPopUp(true);
      }
      else {
        console.log(response.data);
        alert("Wrong Password");
      }

    } else {

      // Register User 
      console.log(fullName, email, password);
      try {
        const response = await axios.post("/register", { fullName, userName, email, password });

        console.log(response.data);
        setUser("Login")
        toast.success("Account create successfully!");
      } catch (error) {
        console.log(error);
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
