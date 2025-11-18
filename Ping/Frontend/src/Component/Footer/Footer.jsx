import React from 'react'
import './Footer.css' 
import india from '../../assets/indialogo.png';

const Footer = () => {
  return (
    <div className='footer-container'>
        <div className="footer-left-container">
            <p>Copyright © 2025 Ping</p>
            <p>Help Center</p>
            <p>Term</p>
            <p>Privacy Policy</p>
        </div>
        <div className="footer-right-container"> 
            <img className='indialogo' src={india} alt="" />
            <p>India</p>
        </div>
    </div>
  )
}

export default Footer