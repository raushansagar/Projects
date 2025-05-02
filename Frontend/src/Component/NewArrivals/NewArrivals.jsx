import React, { useContext } from 'react'
import './NewArrivals.css'
import { StoreContext } from '../../StoreContext/StoreContext'
import { Link } from 'react-router-dom'
import Menu from '../Menu/Menu';
import img from '../../frontend_assets/1694.png';


const NewArrivals = () => {

  const { changeCategory, changeArrival, changeDiscount } = useContext(StoreContext);

  return (
    <div className="NewArrivals_Container" id='explore-new-items'>
      <h1>Explore New Arrivals</h1>
      <div className="NewArrivals_items">
        <div className="NewArrivals_data">
          <h2>Step Into Style – New Arrivals Just Dropped!</h2>
          <p>Discover fresh fashion, tech, and more! 🎉 Shop the latest styles and deals made just for you. New arrivals drop weekly – don’t miss out!</p>
          <Link to="/shop" onClick={() => {
            changeCategory("All");
            changeDiscount("0%")
            changeArrival(true);
          }}>
          <button>Shop Now</button></Link>
        </div>
        
        <img src={img} alt="" />
      </div>
    </div>
  );
};

export default NewArrivals;