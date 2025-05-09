import React, { useContext, useState } from 'react';
import './Order.css';
import { StoreContext } from '../../StoreContext/StoreContext';
import { toast } from 'react-toastify';
import axios from '../../axios.js';
import { Link } from 'react-router-dom'



const Order = () => {
  const { cartItems, getTotalCartAmount, token, setCartItems } = useContext(StoreContext);

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Delivery Info:', deliveryInfo);
    toast.success("Address Saved!");
  };


  const handlePlaceOrder = async () => {

    try {
      const response = await axios.post("/orderPlaced", {
        items: cartItems,
        address: deliveryInfo,
        amount: totalAmount,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Order placed successfully!");
      setCartItems({});
    } catch (error) {
      toast.error("Order Failed!");
    }

  };

  const shippingCost = getTotalCartAmount() > 0 ? 45 : 0;
  const totalAmount = getTotalCartAmount() + shippingCost;

  return (
    <div className="Order_container">
      {/* Delivery Info */}
      <div className="deliveryInfo">
        <h2>Delivery Information</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" required value={deliveryInfo.fullName} onChange={handleInputChange} />
          <input type="text" name="phone" placeholder="Phone Number" required value={deliveryInfo.phone} onChange={handleInputChange} />
          <input type="text" name="address" placeholder="Address" required value={deliveryInfo.address} onChange={handleInputChange} />
          <input type="text" name="city" placeholder="City" required value={deliveryInfo.city} onChange={handleInputChange} />
          <input type="text" name="zip" placeholder="ZIP Code" required value={deliveryInfo.zip} onChange={handleInputChange} />
          <button type="submit">Save Address</button>
        </form>
      </div>

      {/* Cart Summary + Payment */}
      <div className="cardTotal">
        <h2>Order Summary</h2>
        <div className="summaryItem">
          <span>Subtotal</span>
          <span>₹{getTotalCartAmount()}</span>
        </div>
        <div className="summaryItem">
          <span>Shipping</span>
          <span>₹{shippingCost}</span>
        </div>
        <div className="summaryItem total">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        {/* Payment Method Radio */}
        <div className="paymentMethod">
          <h3>Select Payment Method</h3>
          <label>
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit/Debit Card
          </label>
        </div>

        {/* Place Order Button */}
        <Link className="placeOrderBtn" to="/" onClick={handlePlaceOrder}>Place Order</Link>
      </div>
    </div>
  );
};

export default Order;
