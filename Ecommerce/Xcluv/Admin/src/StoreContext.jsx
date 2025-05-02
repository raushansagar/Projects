import { createContext, useEffect, useState } from "react";
import axios from "./axios.js";

// Store context 
export const StoreContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [order, setOrder] = useState([]);

  // Fetch products
  const findProduct = async () => {
    try {
      const response = await axios.post("/getProduct");
      setProduct(response.data.data.product);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch orders
  const findOrderPlaced = async () => {
    try {
      const response = await axios.post("/getOrderPlaced");
      setOrder(response.data.data.order);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Initial data load
  useEffect(() => {
    findProduct();
    findOrderPlaced();
  }, []);

  // Debug log for both products and orders
  useEffect(() => {
    // console.log("Updated products:", product);
    // console.log("Updated orders:", order);
  }, [product, order]);




  const contextValue = {
    product,
    setProduct,
    order,
    setOrder,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
