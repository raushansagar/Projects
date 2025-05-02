import React, { useContext } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../StoreContext/StoreContext'
import axios from '../../axios.js';

const Navbar = () => {
    const { loginPopUp, setLoginPopUp, userData, setUserData, url } = useContext(StoreContext);

    const onLogout = async () => {
        if (!loginPopUp) {
            const response = await axios.post("/logout");
            console.log(response);

            if (response.status) {
                localStorage.removeItem("token");
                setUserData([]);
                setLoginPopUp(true);
                setUserData(null);
            }
            else {
                alert(response.data);
            }
        }
    }

    return (
        <div className='Navbar_container'>
            <div className='Navbar_left'>
                <Link to="/"><h2>XCLUV <span>🛍️</span></h2></Link>
            </div>
            <div className='Navbar_center'>
                <li><Link to="/">Home</Link></li>
                <li><a href='#explore-category' >Shop</a></li>
                <li><a href='#explore-new-items'>New Arrivals</a></li>
                <li><a href='#explore-about'>About Us</a></li>
            </div>
            <div className='Navbar_right'>
                <div className='Navbar_cart'>
                    <Link to={'/cart'}><i className="bi bi-cart4"></i></Link>
                </div>
                <div className='Navbar_Profile'>
                    <button><i className="bi bi-person-circle"></i> {userData === null ? "Login" : userData.fullName}</button>
                    <ul className="dropdown_menu">
                        {
                            userData === null ? "" :
                                <>
                                    <li><button><i className="bi bi-person-circle"></i>  My Profile</button></li>
                                    <Link to="/orderPlaced"><li><button><i className="bi bi-box"></i>  Order</button></li></Link>
                                    <li><button><i className="bi bi-heart"></i>  Wishlist</button></li>
                                    <li><button onClick={() => onLogout()}><i className="bi bi-door-closed"></i>  Logout</button></li>
                                </>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
