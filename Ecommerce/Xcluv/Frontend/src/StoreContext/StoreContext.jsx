import { createContext, useEffect, useState } from "react";
import axios from "../axios.js";
import '../App.css';


// store context 
export const StoreContext = createContext(null);

export const ContextProvider = (props) => {

    // url 
    const url = "http://localhost:9000/xcluv/v2/users";

    //Backend items
    const [product, setProduct] = useState([]);
    const [menu, setMenu] = useState([]);
    const [order, setOrder] = useState([]);


    const [loginPopUp, setLoginPopUp] = useState(false);
    const [token, setToken] = useState("");


    // procuct and menu data fetch
    const dataFetch = async () => {
        const response = await axios.post("/getProduct");
        setProduct(response.data.data.product);
        setMenu(response.data.data.menu);
    }


    // Fetch orders
    const findOrderPlaced = async () => {
        try {
            const response = await axios.post("/getOrderPlaced");
            setOrder(response.data.data.order);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };



    //store currUserData 
    const [userData, setUserData] = useState(null);


    // add cart items
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : {};
    });


    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    }


    // get Total Cart Amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const it in cartItems) {
            if (cartItems[it] > 0) {
                let itemInfo = product.find((product) => product._id === it);

                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[it];
                }
            }
        }

        return totalAmount;
    };


    // curr user data fetch
    const userDataFetch = async () => {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            "/userData",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setUserData(response.data.data.user);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {

            //card items 
            localStorage.setItem("cartItems", JSON.stringify(cartItems));

            // product order and menu data fetch
            dataFetch();
            findOrderPlaced();

            // user data fetch
            userDataFetch();

            // set access tokem
            setUserData(userData);

            //set access token 
            localStorage.setItem("token", token);

            //set login popup
            document.body.style.overflow = "auto";
        }
        else {
            setCartItems({});
            setLoginPopUp(true);
            document.body.style.overflow = "hidden";
        }


    }, [loginPopUp, cartItems])



    //view Items
    const [viewItems, setViewItems] = useState("none");




    //remove cart items
    const removeToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }



    //set category
    const [category, setCategory] = useState("All");
    const changeCategory = (val) => {
        setCategory(val);
    }


    //set discount
    const [discount, setDiscount] = useState("0%");
    const changeDiscount = (val) => {
        setDiscount(val);
    }


    //new arrivals
    const [newArrival, setNewArrival] = useState(false);
    const changeArrival = (val) => {
        setNewArrival(val);
    }


    //filter Items
    const daysAgo = 14;
    const cutoffDate = new Date();
    cutoffDate.setDate(new Date().getDate() - daysAgo);

    const productFilter = product?.filter(item => {
        // Category filter
        const categoryMatch = category === "All" || item.category === category;

        // Discount filter
        const discountMatch = discount === "0%" || item.discount >= discount;

        // New Arrivals filter (only apply if newArrival is true)
        const newArrivalsMatch = newArrival && new Date(item.updatedAt) >= cutoffDate;

        return categoryMatch && discountMatch || (newArrival && newArrivalsMatch);
    });


    //flter items
    const filterOrder = Array.isArray(order) && userData && Array.isArray(userData.orders)
        ? order.filter(item =>
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
        url,
        setCartItems,
        order,
        filterOrder,
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}