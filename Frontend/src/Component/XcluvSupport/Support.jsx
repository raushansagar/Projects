import React from 'react'
import './Support.css'
import fast from '../../frontend_assets/fast.png';
import twofour from '../../frontend_assets/twofour.png';
import quality from '../../frontend_assets/quality.png';


const Support = () => {
  return (
    <div className="support">
      <div className='support_container'>

        <div className="feature-card">
          <img src={quality} alt="Best Quality" />
          <h3>Best Quality</h3>
          <p>Our products are crafted with care and precision, ensuring only the finest quality reaches your hands</p>
        </div>

        <div className="feature-card">
          <img src={twofour} alt="Good Service" />
          <h3>Good Service</h3>
          <p>We put customers first, offering prompt support and a smooth, hassle-free experience every step of the way</p>
        </div>

        <div className="feature-card">
          <img src={fast} alt="Fast Delivery" />
          <h3>Fast Delivery</h3>
          <p>Get what you need, when you need it — our lightning-fast delivery ensures you're never left waiting</p>
        </div>

      </div>
    </div>
  )
}

export default Support
