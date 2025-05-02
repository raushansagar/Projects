import React, { useContext, useState } from 'react';
import axios from '../../axios.js';
import { StoreContext } from '../../StoreContext.jsx';
import './Order.css';

const STATUS_OPTIONS = [
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const Order = () => {
  const { product, order } = useContext(StoreContext);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.post(`/orderStatus`,
        {
          orderId: orderId,
          status: newStatus,
        });

      alert(`Status for order ${orderId} updated to ${newStatus}`);
    } catch (err) {

      console.error('Status update error:', err);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="order-management">
      <header className="order-header">
        <h1>Order Management Dashboard</h1>
      </header>

      <div className="orders-grid">
        {order.map((orderItem) => (
          <OrderCard
            key={orderItem._id}
            order={orderItem}
            products={product}
            onStatusChange={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ order, products, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getProductDetails = (productId) => {
    return products.find((p) => p._id === productId) || {};
  };

  return (
    <div className="allOrderContainer">
      <article className="order-card">
        <div className="order-meta">
          <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
          <time dateTime={order.createdAt}>{formattedDate}</time>
        </div>

        <div className="order-details">
          <section className="customer-info">
            <h4>Customer Details</h4>
            <p>{order.address.fullName}</p>
            <p>{order.address.phone}</p>
            <p>{order.address.city}, {order.address.country}</p>
          </section>

          <section className="order-summary">
            <h4>Order Summary</h4>
            <p className="order-amount">Total: ₹{order.amount.toFixed(2)}</p>
            <div className="status-indicator">
              Current Status: <span>{order.orderStatus}</span>
            </div>
          </section>
        </div>

        <section className="order-items">
          <h4>Items ({order.items.length})</h4>
          <ul>
            {order.items.map((item, index) => {
              const productInfo = getProductDetails(item.productId);
              const productName = productInfo.name || item.name || 'Unnamed Product';
              const totalItemPrice = item.price * item.quantity;

              return (
                <li key={index} className="order-item">
                  <span className="item-name">{productName}</span>
                  <span className="item-quantity">× {item.quantity}</span>
                  <span className="item-price">₹{item.price} each</span>
                  <span className="item-total">= ₹{totalItemPrice}</span>
                </li>
              );
            })}
          </ul>
          <div className="order-total-amount">
            <strong>Total Amount: ₹{order.amount.toFixed(2)}</strong>
          </div>
        </section>

        <div className="status-control">
          <label htmlFor={`status-${order._id}`}>Update Status:</label>
          <select
            id={`status-${order._id}`}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-selector"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className="update-status-btn"
            onClick={() => onStatusChange(order._id, selectedStatus)}
            style={{
              marginTop: '8px',
              padding: '5px 10px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Update Status
          </button>
        </div>
      </article>
    </div>
  );
};

export default Order;
