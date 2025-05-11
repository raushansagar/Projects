import React, { useContext } from 'react';
import './CurrentOrder.css';
import { StoreContext } from '../../StoreContext/StoreContext';



const CurrentOrder = () => {
    const { filterOrder } = useContext(StoreContext);

    // No orders yet
    if (!filterOrder || filterOrder.length === 0) {
        return <div className="current-order-empty">No orders placed yet.</div>;
    }

    // Helper function to get progress information based on order status
    const getProgressInfo = (status) => {
        switch (status.toLowerCase()) {
            case "processing":
                return { width: "25%", color: "bg-info", textColor: "#0c4a6e" };
            case "shipped":
                return { width: "75%", color: "bg-primary", textColor: "#1d4ed8" };
            case "delivered":
                return { width: "100%", color: "bg-success", textColor: "#064e3b" };
            case "canceled":
                return { width: "100%", color: "bg-danger", textColor: "#9b1c1c" };
            default:
                return { width: "0%", color: "bg-secondary", textColor: "#6b7280" };
        }
    };

    return (
        <div className="cart">
            <h2>Your Orders</h2>
            {filterOrder.slice().reverse().map((order) => {
                const { width, color, textColor } = getProgressInfo(order.orderStatus);

                return (
                    <div key={order._id} className="order-card">
                        <div className="order_info">
                            <div className="order-header">
                                <div className="order-header-card">
                                    <div className="order-details">
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                        <p className="orderStatus" style={{ color: textColor }}>
                                            <strong>Status:</strong> {order.orderStatus}
                                        </p>
                                    </div>

                                    {/* Hover button for Order Summary */}
                                    <div className="hover-container">
                                        <button className="hover-button">View Order Summary</button>
                                        <div className="total_cart">
                                            <h4>Total: ₹{order.amount}</h4>
                                            <hr />
                                            <h4>Shipping Address:</h4>
                                            <p>{order.address.fullName}</p>
                                            <p>{order.address.city} - {order.address.zip}</p>
                                            <p>{order.address.country}</p>
                                            <p>Phone: {order.address.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Progress Bar */}
                                <div
                                    className="progress"
                                    role="progressbar"
                                    aria-label="Order Progress"
                                    aria-valuenow={parseInt(width)}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    <div
                                        className={`progress-bar progress-bar-striped progress-bar-animated ${color}`}
                                        style={{ width }}
                                    >
                                        {width}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="cart_items_title">
                            <div className="cart_top">
                                <p>Product ID</p>
                                <p>Quantity</p>
                            </div>
                            <hr />
                            {order.items.map((item) => (
                                <div className="cart_items_items" key={item._id}>
                                    <p>{item.productId}</p>
                                    <p>{item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <hr className="order-separator" />
                    </div>
                );
            })}
        </div>
    );
};

export default CurrentOrder;
