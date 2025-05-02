import React, { useContext } from 'react'
import './DisplayItems.css'
import { StoreContext } from '../../StoreContext/StoreContext.jsx'
import Items from '../Items/Items.jsx'
import noImg from '../../frontend_assets/notFount.jpg'

const DisplayItems = () => {

    const { newArrival, setNewArrival, discount, changeDiscount, category, changeCategory, productFilter } = useContext(StoreContext);

    return (
        <>
            <div className='Display'>
                <h2>Online <span className='logo'>XCLUV</span> Clothing Products</h2>
                <div className="Display_Items">
                    <div className="Display_Filter">
                        <h3>Filters</h3>
                        <hr />
                        <div className="Category">
                            <h2>Category</h2>
                            <div className="box">
                                {["All", "Men", "Women", "Kids"].map((categoryItems, idx) => (
                                    <label key={idx}>
                                        <input
                                            checked={categoryItems === category}
                                            onChange={(e) => changeCategory(e.target.value)}
                                            type="checkbox"
                                            value={categoryItems} /> {categoryItems}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <hr />
                        <div className="discount">
                            <h3>Discount</h3>
                            <div className="box">
                                {["0%", "40%", "50%", "60%", "70%"].map((discountItems, idx) => (
                                    <label key={idx}>
                                        <input type="checkbox"
                                            checked={discountItems === discount}
                                            onChange={(e) => changeDiscount(e.target.value)}
                                            value={discountItems} /> {discountItems}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <hr />
                        <div className="new_arrival">
                            <h3>New Arrivals</h3>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newArrival} 
                                    onChange={() => setNewArrival(!newArrival)}
                                />
                                <span className='ab'> New Collections</span>
                            </label>
                        </div>
                    </div>
                    <div className="Display_All_Items">
                        {productFilter.length > 0 ? productFilter.map(item => (
                            <Items key={item._id} items={item} discounts={item.discount} />
                        ))
                            : <div className="notFount">
                                <img id='notFountImg' src={noImg} alt="" />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default DisplayItems;
