import React, { useContext, useState } from "react";
import './Home.css'
import { StoreContext } from '../../StoreContext/StoreContext'
import home from '../../assets/home.png'
import LoadingMessage from "../LoadingMessage/LoadingMessage";
import hero from '../../assets/hero.png';


const Home = (user) => {
  const { notification, setNotification } = useContext(StoreContext);

  return (
    <div className='Home-page'>
      <div className="home-heading">
        <div className="new-friend-search-box">
          {/* <input type="text" /> */}
        </div>
        <div className="Home-page-user-profile">
          <img src={user?.user?.avatar} alt="" />
          <ion-icon onClick={() => setNotification(!notification)} name="notifications"></ion-icon>
        </div>
      </div>
      <div className="home-center-wrapper">
        <div className="home-secions">
          <span className="p">P</span>
          <span className="i">i</span>
          <span className="n">n</span>
          <span className="g">g</span>
        </div>
      </div>
    </div>
  )
}

export default Home
