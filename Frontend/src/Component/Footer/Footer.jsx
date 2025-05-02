import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className="Footer_container" id='explore-about'>
            <div className='Footer'>
                <div className='Left:'>
                    <h3>Xcluv Content</h3>
                    <p>📍 Address: 123, XYZ Street, City, Country, ZIP Code</p>
                    <h3>📞 Contact Us:</h3>
                    <p>+91 98720 84444 | fashion@xcluv.com</p>
                </div>
                <div className='Center'>
                    <div className="company">
                        <h4>COMPANY</h4>
                        <p>About Us</p>
                        <p>Contact Us</p>
                        <p>Privacy Policy</p>
                        <p>Terms & Conditions</p>
                        <p>FAQs</p>
                    </div>
                    <div className="follow">
                        <h3>GET IN TOUCH </h3>
                        <li><Link to="/Contact">Facebook</Link></li>
                        <li><Link to="/Contact">Instagram</Link></li>
                        <li><Link to="/Contact">Twitter</Link></li>
                        <li><Link to="/Contact">LinkedIn</Link></li>
                    </div>
                </div>
                <div className='Right'>
                    <div className="trust">
                    <h4>🔒 Trust & Security</h4>
                    <p>✔ Verified Sellers: We ensure quality and authenticity <br />in every product.</p>
                    <p>✔ Customer Protection: Easy returns and refund policies.</p>
                    <p>✔ 24/7 Support: We're here to assist you anytime.</p>
                    </div>
                </div>
            </div>
            <hr></hr>
            <p className='copy_right'>Copyright 2025 © Xcluv.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
