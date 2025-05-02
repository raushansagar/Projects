import React, { useContext } from 'react'
import './Discount.css'
import { Link } from 'react-router-dom'
import discont from '../../frontend_assets/discount.png';
import { StoreContext } from '../../StoreContext/StoreContext';

const Discount = () => {

    const {changeCategory, changeDiscount, changeArrival} = useContext(StoreContext);

    return (
        <div className='discountContainers'>
            <h1>50% OFF | Fresh Fashion Finds</h1>
            <div className="discount_Items">
                <div className="discountData_Items">
                    <h3>Up to 20% - 50% OFF on all fashion clothes </h3>
                    <p>Revamp your wardrobe with up to 50% OFF on all fashion items. Style meets savings!</p>
                    <Link to="/shop" onClick={() => {
                        changeCategory("All");
                        changeDiscount("40%");
                        changeArrival(false);
                    }}>
                        <button>Shop Now</button></Link>
                </div>
                <img src={discont} alt="" />
            </div>
        </div>
    )
}

export default Discount
