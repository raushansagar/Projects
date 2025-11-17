import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, fetchUser, logoutUser, fetchAllUser, getPendingRequests } from "../Api/auth.js";

export const StoreContext = createContext(null);

export const ContextProvider = ({ children }) => {
    const [login, setLogin] = useState(true);   // true = login, false = signup
    const [user, setUser] = useState(null);
    const [allUser, setAllUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(false);
    const [pendingReq, setPendingReq] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const pending = await getPendingRequests();
                const currentUser = await fetchUser();
                setUser(currentUser?.user);
                setPendingReq(pending);
            } catch (error) {
                console.error("Failed to fetch pending requests:", error);
            }
        };

        if (notification) {
            fetchPending();
        }

    }, [notification]);


    // Fetch user
    const loadUser = useCallback(async () => {
        setLoading(true);
        try {
            const currentUser = await fetchUser();
            const allUserData = await fetchAllUser();
            const pending = await getPendingRequests();
            setPendingReq(pending);
            setUser(currentUser?.user);
            setAllUser(allUserData);
        } catch (err) {
            console.error("Failed to load user", err);
            setUser(null);
            setAllUser(null);
            setLogin(true);
        } finally {
            setLoading(false);
        }
    }, []);


    // Login handler
    const loginHandler = useCallback(async (identifier, password) => {
        try {
            const { user } = await loginUser(identifier, password);
            setUser(user);
            setLogin(true);
            navigate("/chat");   // redirect after login
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    }, [navigate]);

    // Logout handler
    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setAllUser(null);
            setLogin(true);
            navigate("/");   // redirect after logout
        }
    }, [navigate]);

    // Auto reload user + handle auth failures
    useEffect(() => {
        loadUser();
        const handleAuthFail = () => logout();
        window.addEventListener("auth-failed", handleAuthFail);
        return () => window.removeEventListener("auth-failed", handleAuthFail);
    }, [loadUser, logout]);

    const contextValue = {
        login, setLogin,
        user, setUser,
        loadUser, loading, setLoading,
        loginHandler, logout,
        allUser, setAllUser,
        notification, setNotification, pendingReq,
        onlineUsers, setOnlineUsers, socket, setSocket
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};
