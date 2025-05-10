import React, { useContext } from 'react';
import './CurrentOrder.css';
import { StoreContext } from '../../StoreContext/StoreContext';

const CurrentOrder = () => {
    const { filterOrder } = useContext(StoreContext);

    if (!filterOrder || filterOrder.length === 0) {
        return <div className="current-order-empty">No orders placed yet.</div>;
    }

    return (
        <div className="cart">
            <h2> Your Orders</h2>

            {filterOrder.map((order) => (
                <div key={order._id} className="order-card">
                    <div className="order_info">
                        <div className="order-header">
                            <div>
                                <p><strong>Order ID:</strong> {order._id}</p>
                                <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                <p><strong>Status:</strong> {order.orderStatus}</p>
                            </div>
                            <div className="cart_bottom">
                            </div>
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
            ))}
        </div>
    );
};

export default CurrentOrder;
