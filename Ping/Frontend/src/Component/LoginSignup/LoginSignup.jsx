import React, { useContext, useState } from 'react';
import './LoginSignup.css';
import { loginUser, registerUser } from '../../Api/auth';
import { StoreContext } from '../../StoreContext/StoreContext';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';


const LoginSignup = () => {
  const { login, setLogin, loading, setLoading } = useContext(StoreContext);

  return (
    <>
    {login ? <Login/> : <Signup/>}
    </>
  );
};

export default LoginSignup;
