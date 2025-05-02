import { useState } from 'react';
import './App.css';
import { assets } from './assets/admin_assets/assets.js';
import axios from 'axios';
import AddProducts from './Components/AddProducts/AddProducts.jsx';
import ShowProducts from './Components/ShowProducts/ShowProducts.jsx';
import UploadAllProduct from './Components/UploadAllProduct/UploadAllProduct.jsx';
import Order from './Components/Order/Order.jsx';

function App() {
  const [list, setList] = useState("addItems");

    return (
      <div className="container">
        <div className="navbar">
          <img className='logoImg' src={assets.logo} alt="Logo" />
          <h3>Admin Panel</h3>
          <img className='userImg' src={assets.profile_image} alt="User Profile" />
        </div>
        <div className="container_details">
          <div className="left_container">
            <div onClick={() => setList("addItems")}>Add Items</div>
            <div onClick={() => setList("showItems")}>List Items</div>
            <div onClick={() => setList("orderStatus")}>Orders</div>
          </div>
          <div className="right_container">
              {list === "addItems" ? <AddProducts/> : ""}
              {list === "showItems" ? <ShowProducts/> : ""}
              {list === "orderStatus" ? <Order/> : ""}
          </div>
        </div>
      </div>
    );
  };

export default App;