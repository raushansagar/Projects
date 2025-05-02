import React from 'react'
import './Hero.css';
import hero from '../../frontend_assets/hero.png'
import { useContext } from 'react'
import { StoreContext } from '../../StoreContext/StoreContext'
import { Link } from 'react-router-dom'

const Hero = () => {

    const { changeCategory, changeBrand, changeDiscount } = useContext(StoreContext);

    return (
        <div className='hero_container'>
            <div className="hero">
                <div className="heroData">
                    <h3>Up to 50% OFF on all fashion clothes ✨</h3>
                    <p>Get ready to refresh your wardrobe with the trendiest styles at unbeatable prices!<br></br> For a limited time only, enjoy up to 50% OFF on all fashion clothing </p>
                    <li><Link to='/Shop' onClick={() => {
                        changeCategory("All");
                        changeBrand("All");
                        changeDiscount("0%");
                    }
                    }>SHOP NOW</Link></li>
                </div>
                <img src={hero} alt="" />
            </div>
        </div>
    )
}

export default Hero
