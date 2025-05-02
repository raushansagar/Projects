import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // For toast notifications

const Cart = () => {
  const { cartItems, removeToCart, product, getTotalCartAmount } = useContext(StoreContext);

  // Check if the cart is empty and show a toast
  const handleCheckout = () => {
    if (getTotalCartAmount() === 0) {
      toast.error('Your cart is empty. Please add items to proceed.');
    }
  };

  return (
    <div className='cart'>
      <div className="cart_items_title">
        <div className="cart_top">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        <br />
        {product.map((items) => {
          if (cartItems[items._id] > 0) {
            return (
              <React.Fragment key={items._id}>
                <div className="cart_items_items">
                  <img src={items.image} alt={items.name} />
                  <p>{items.name}</p>
                  <p>₹ {items.price}</p>
                  <p>{cartItems[items._id]}</p>
                  <p>₹ {cartItems[items._id] * items.price}</p>
                  <p onClick={() => removeToCart(items._id)}><i className="bi bi-x-lg"></i></p>
                </div>
                <hr />
                <br />
              </React.Fragment>
            )
          }
        })}
        {getTotalCartAmount() === 0 && (
          <p className="empty-cart-message">Your cart is empty. Please add some items!</p>
        )}
      </div>

      <div className="cart_bottom">
        <div className="total_cart">
          <h4>Cart Total</h4>
          <div className="total_cart_details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="total_cart_details">
            <p>Delivery</p>
            <p>₹{getTotalCartAmount() > 0 ? 45 : 0}</p>
          </div>
          <hr />
          <div className="total_cart_details">
            <h3>Total</h3>
            <h3>₹{getTotalCartAmount() > 0 ? getTotalCartAmount() + 45 : 0}</h3>
          </div>
          <li><Link to={getTotalCartAmount() > 0 ? "/order" : "/shop"} onClick={handleCheckout}>PROCEED TO CHECKOUT</Link></li>
        </div>
        <div className="promocode">
          <p>If you have a promo code, Enter it here</p>
          <label htmlFor=""><input type="text" placeholder='Enter Promo Code' /><button>Apply Code</button></label>
        </div>
      </div>
    </div>
  );
};

export default Cart;
