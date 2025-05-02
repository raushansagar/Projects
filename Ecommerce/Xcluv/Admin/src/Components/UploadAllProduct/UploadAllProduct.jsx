
import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../../assets/admin_assets/assets.js'

const UploadAllProduct = () => {
  const [products, setProducts] = useState([
    {
      name: "Women Round Neck Cotton Top",
      description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves.",
      price: 100,
      image: assets.p_img1, // Reference to image
      category: "Women",
      subCategory: "Topwear",
      sizes: ["S", "M", "L"],
      discount: 10,
      bestseller: true,
      sellerName: "FashionHub",
      brand: "CottonCraft",
      rating: 4.5,
      stock: 100,
    },
    {
      name: "Men Casual Cotton Shirt",
      description: "A casual shirt made of soft cotton fabric with short sleeves.",
      price: 200,
      image: assets.p_img2, // Reference to image
      category: "Men",
      subCategory: "Shirts",
      sizes: ["M", "L", "XL"],
      discount: 15,
      bestseller: false,
      sellerName: "StyleStore",
      brand: "CottonCraft",
      rating: 4.0,
      stock: 150,
    },
    // Add more products...
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Loop through each product and append to FormData
      products.forEach((product, index) => {
        Object.entries(product).forEach(([key, value]) => {
          if (key === 'sizes') {
            value.forEach(size => formData.append(`sizes[${index}]`, size));
          } else if (key === 'image') {
            // Assuming image is being sent as a URL or a file
            formData.append(`image[${index}]`, value); // For URL or File, ensure it's handled appropriately
          } else {
            formData.append(`${key}[${index}]`, value);
          }
        });
      });

      // Send the FormData with multiple products to backend
      const response = await axios.post(
        'http://localhost:9000/xcluv/v2/users/addAllProduct',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Products submitted:', response.data);

    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="right_container">
      <div className="add_items">
        <form onSubmit={handleSubmit}>
          <button type="submit" className="submit-btn">Submit All Products</button>
        </form>
      </div>
    </div>
  );
};

export default UploadAllProduct;