import React, { useState } from 'react';
import axios from '../../axios.js';
import './Order.css';

const Order = () => {
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState(null); 


  console.log(orders);


  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.post('/getOrderPlaced');
      setOrders(response.data.data.order); // Set the fetched orders to state
      setError(null); // Reset any previous error
    } catch (error) {
      console.log(error);
      setError('Error fetching order data'); // Set error message if failed
    }
  };



  // Handle status change for an order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/order/${orderId}/status`, { status: newStatus });
      
      // Update the order in the state with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.log(error);
      alert('Error updating order status');
    }
  };



  return (
    <div>
      <button onClick={fetchOrders}>Get Order Placed Items</button>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              width: '300px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3>Order ID: {order._id}</h3>
            <p><strong>Full Name:</strong> {order.address.fullName}</p>
            <p><strong>Phone:</strong> {order.address.phone}</p>
            <p><strong>City:</strong> {order.address.city}</p>
            <p><strong>Country:</strong> {order.address.country}</p>
            <p><strong>Amount:</strong> ₹{order.amount}</p>
            <p><strong>Order Status:</strong> {order.orderStatus}</p>
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}</strong> - ₹{item.price} x {item.quantity}
                </li>
              ))}
            </ul>

            <div>
              <label htmlFor={`status-${order._id}`}>Change Status: </label>
              <select
                id={`status-${order._id}`}
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
