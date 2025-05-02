import React, { useContext, useState } from 'react'
import './ShowProducts.css';
import axios from '../../axios.js';
import { StoreContext } from '../../StoreContext.jsx';


const ShowProducts = () => {

    const { product } = useContext(StoreContext);

    return (
        <>
            <div className='getProduct'>
                {/* <button onClick={getProducts}>Get Data</button> */}
            </div>
            <div className="contianer">
                {product.length > 0 && (
                    <div className="products-container">
                        <h1 className="products-header">Our Products</h1>
                        <div className="products-grid">
                            {product.map((item, idx) => (
                                <div className="product-card" key={item._id || idx}>
                                    <a href={`/products/${item._id}`} className="product-link">
                                        <div className="product-image-container">
                                            {item.bestseller && (
                                                <span className="bestseller-badge">Bestseller</span>
                                            )}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="product-image"
                                            />
                                        </div>

                                        <div className="product-details">
                                            <h3 className="product-name">{item.name}</h3>

                                            <div className="price-section">
                                                {item.discount > 0 ? (
                                                    <>
                                                        <span className="original-price">
                                                            ₹{item.price}
                                                        </span>
                                                        <span className="discounted-price">
                                                            ₹{(item.price * (1 - item.discount / 100)).toFixed(2)}
                                                        </span>
                                                        <span className="discount-percent">
                                                            ({item.discount}% OFF)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="current-price">
                                                        ₹{item.price}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="product-meta">
                                                <span className="category">{item.category}</span>
                                                <div className="rating">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`star ${i < item.rating ? 'filled' : ''}`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default ShowProducts;
