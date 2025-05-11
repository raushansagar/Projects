import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeToCart, product, getTotalCartAmount } = useContext(StoreContext);

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
        {product.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <React.Fragment key={item._id}>
                <div className="cart_items_items">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹ {item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹ {cartItems[item._id] * item.price}</p>
                  <p onClick={() => removeToCart(item._id)}><i className="bi bi-x-lg"></i></p>
                </div>
                <hr />
                <br />
              </React.Fragment>
            );
          }
          return null;
        })}
        {getTotalCartAmount() === 0 && (
          <p className="empty-cart-message">Your cart is empty. Please add some items!</p>
        )}
      </div>
      <div className="cart_bottom">
        <div className="total">
          <h4>Cart Total</h4>
          <div className="total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className='total_cart_detail'>
            <p>Delivery</p>
            <p>₹{getTotalCartAmount() > 0 ? 45 : 0}</p>
          </div>
          <div className="total_cart_detail">
            <h3>Total</h3>
            <h3>₹{getTotalCartAmount() > 0 ? getTotalCartAmount() + 45 : 0}</h3>
          </div>
        </div>
        <label className='checkout'>
          <Link
            to={getTotalCartAmount() > 0 ? "/order" : "/shop"}
            onClick={handleCheckout}
            className="checkout-btn"
          >
            <button className='btn12'>PROCEED TO CHECKOUT</button>
          </Link>
        </label>
        <div className="promocode">
          <p>If you have a promo code, enter it here</p>
          <label>
            <input type="text" placeholder='Enter Promo Code' />
            <button>Apply Code</button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Cart;
