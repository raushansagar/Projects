import React, { useState, useRef } from 'react';
import './AddProducts.css';
import axios from 'axios';
import { assets } from '../../assets/admin_assets/assets';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: '',
    subCategory: '',
    sizes: [],
    discount: '',
    bestseller: false,
    sellerName: '',
    brand: '',
    rating: '',
    stock: '',
  });

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInput = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'sizes') {
          value.forEach(size => data.append('sizes', size));
        } else if (key === 'image' && value) {
          data.append(key, value);
        } else if (key === 'bestseller') {
          data.append(key, value.toString());
        } else {
          data.append(key, value);
        }
      });

      const response = await axios.post(
        'http://localhost:9000/xcluv/v2/users/product',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Product submitted:', response.data);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null,
        category: '',
        subCategory: '',
        sizes: [],
        discount: '',
        bestseller: false,
        sellerName: '',
        brand: '',
        rating: '',
        stock: '',
      });

      // Reset file input
      if (fileInput.current) fileInput.current.value = '';
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Submission failed. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        sizes: checked 
          ? [...prev.sizes, value]
          : prev.sizes.filter(size => size !== value)
      }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === 'bestseller') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
        <div className="right_container">
          <div className="add_items">
            {submitError && <div className="error-message">{submitError}</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  ref={fileInput}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Kids">Kids</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subCategory">Subcategory</label>
                <input
                  type="text"
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  placeholder="Enter Subcategory"
                  required
                />
              </div>

              <div className="form-group">
                <label>Available Sizes</label>
                <div className="size-group">
                  {["S", "M", "L", "XL"].map((size) => (
                    <label key={size}>
                      <input
                        type="checkbox"
                        name="sizes"
                        value={size}
                        checked={formData.sizes.includes(size)}
                        onChange={handleInputChange}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g., 18%"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bestseller">Bestseller</label>
                <select
                  id="bestseller"
                  name="bestseller"
                  value={formData.bestseller.toString()}
                  onChange={handleInputChange}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sellerName">Seller Name</label>
                <input
                  type="text"
                  id="sellerName"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleInputChange}
                  placeholder="KidzFashion"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="TinyTrends"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Seller Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="e.g., 4.3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="e.g., 100"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
  );
};

const AddProducts = () => <ProductForm />;

export default AddProducts;