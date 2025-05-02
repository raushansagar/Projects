import React, { useContext } from 'react'
import './ItemsDetails.css'
import { StoreContext } from '../../StoreContext/StoreContext';


const ItemsDetails = () => {
    const {product, viewItems, addToCart} = useContext(StoreContext);
    
    return (
        <>
            <div className='ItemsDetails'>
                <h2 className='ItemsDetails_head_h2'>Online <span>XCLUV</span> Clothing Products</h2>
                {product?.map((items) =>
                    items._id === viewItems && (
                        <div className='ItemsDetails_Container' key={items._id}>
                            <div className='ItemsDetails_left'>
                                <div className="ItemsDetails_Container_Img">
                                    <img src={items.image} alt={items.name} />
                                </div>
                            </div>
                            <div className='ItemsDetails_right'>
                                <h4>{items.name}</h4>
                                <p>{items.subCategory}</p>
                                    <div className="rating">
                                        <ion-icon name="star"></ion-icon>
                                        <p id='ratingNum'>{items.rating}</p>
                                        <div className="line"></div>
                                        <p>Rating</p>
                                    </div>
                                <hr />
                                <div className="price">
                                    <div className="currPrice">
                                    <h4>RS {items.price - (items.price * parseFloat(items.discount) / 100)}</h4>
                                    </div>
                                    <div className="offerPrice">
                                        <h4  id='offercross'>Rs {items.price}</h4>
                                        <h4>UP TO  {items.discount} OFF</h4>
                                    </div>
                                </div>
                                <div className="size">
                                    <h4>Select Size Chart</h4>
                                    <div className="selectChart">
                                        {items.sizes.map((size => {
                                            return (
                                                <div key={size} className="size-38">{size}</div>
                                            )
                                        }))}
                                    </div>
                                </div>
                                <div className="cart_buy">
                                    {/* <button>Buy</button> */}
                                    <button onClick={() => addToCart(items._id)}>Add To Cart</button>
                                </div>
                                <h4 className='delivery_options'>Delivery Options</h4>
                                <div className="pincode">
                                    <label>
                                        <input type="text" placeholder="Enter pincode" maxLength="6" pattern="\d{6}" title="Enter a 6-digit number" required />
                                        <button>Check</button>
                                    </label>
                                </div>
                                <div className="product_details">
                                    <h4>Product Details <ion-icon name="document-text-outline"></ion-icon></h4>
                                    <p>100% Original Products <br /> Pay on delivery might be available <br /> Easy 14 days returns and exchanges</p>
                                    <h4>Specifications</h4>
                                    <p>{items.description}</p>
                                </div>
                                <div className="product_code">
                                    <h5>Product Code:  <p id='product_p'>{items._id}</p></h5>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default ItemsDetails;
