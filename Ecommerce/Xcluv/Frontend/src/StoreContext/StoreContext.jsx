import { createContext, useEffect, useState } from "react";
import axios from "../axios.js";
import "../App.css";

// Store context
export const StoreContext = createContext(null);

export const ContextProvider = (props) => {

    // Backend data states
    const [product, setProduct] = useState([]);
    const [menu, setMenu] = useState([]);
    const [order, setOrder] = useState([]);

    // User state
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState("");
    const [loginPopUp, setLoginPopUp] = useState(false);

    // Cart
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : {};
    });

    // View Item Toggle
    const [viewItems, setViewItems] = useState("none");

    // Filters
    const [category, setCategory] = useState("All");
    const [discount, setDiscount] = useState("0%");
    const [newArrival, setNewArrival] = useState(false);

    const changeCategory = (val) => setCategory(val);
    const changeDiscount = (val) => setDiscount(val);
    const changeArrival = (val) => setNewArrival(val);

    // Fetch product and menu
    const dataFetch = async () => {
        const response = await axios.post(
            'https://xcluv-backend.onrender.com/xcluv/v2/users/getProduct',
            {},  // or your request body
            { withCredentials: true }
          );

        setProduct(response.data.data.product);
        setMenu(response.data.data.menu);
    };

    // Fetch order data
    const findOrderPlaced = async () => {
        try {
            const response = await axios.post("/getOrderPlaced");
            setOrder(response.data.data.order);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Fetch current user
    const userDataFetch = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(
                "/userData",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response);
            setUserData(response.data.data.user);
        } catch (err) {
            console.error("User data fetch failed:", err);
            setUserData(null);
        }
    };



    // Run once on mount
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            dataFetch();
            findOrderPlaced();
            userDataFetch();
            document.body.style.overflow = "auto";
        } else {
            setCartItems({});
            setLoginPopUp(true);
            document.body.style.overflow = "hidden";
        }
    }, [loginPopUp]);


    // Sync cartItems with localStorage
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);




    // Add/Remove cart items
    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const removeToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }));
    };

    // Total cart value
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const it in cartItems) {
            if (cartItems[it] > 0) {
                const itemInfo = product.find((p) => p._id === it);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[it];
                }
            }
        }
        return totalAmount;
    };

    // Filter products
    const daysAgo = 14;
    const cutoffDate = new Date();
    cutoffDate.setDate(new Date().getDate() - daysAgo);

    const productFilter = product?.filter((item) => {
        const categoryMatch = category === "All" || item.category === category;
        const discountMatch = discount === "0%" || item.discount >= discount;
        const newArrivalsMatch = new Date(item.updatedAt) >= cutoffDate;

        return (
            (categoryMatch && discountMatch) ||
            (newArrival && newArrivalsMatch)
        );
    });

    // Filter orders specific to current user
    const filterOrder =
        Array.isArray(order) &&
        userData &&
        Array.isArray(userData.orders)
            ? order.filter((item) =>
                  userData.orders.includes(item._id?.toString())
              )
            : [];

    const contextValue = {
        viewItems,
        setViewItems,
        product,
        menu,
        category,
        setCategory,
        changeCategory,
        discount,
        setDiscount,
        changeDiscount,
        cartItems,
        addToCart,
        removeToCart,
        getTotalCartAmount,
        token,
        setToken,
        loginPopUp,
        setLoginPopUp,
        productFilter,
        newArrival,
        setNewArrival,
        changeArrival,
        userData,
        setUserData,
        setCartItems,
        order,
        filterOrder,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};
