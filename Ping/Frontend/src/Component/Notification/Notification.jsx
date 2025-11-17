import React, { useState, useEffect, useContext } from "react";
import './Notification.css'
import { toast } from "react-toastify";
import { acceptFriendRequest, declineFriendRequest } from "../../Api/auth";
import { StoreContext } from "../../StoreContext/StoreContext";

const Notification = ({ sender }) => {
  const [notifications, setNotifications] = useState([]);
  const { allUser } = useContext(StoreContext);

  useEffect(() => {
    setNotifications(sender || []);
  }, [sender]);

  // Remove a request from UI instantly
  const removeRequest = (id) => {
    setNotifications((prev) => prev.filter((req) => req.sender._id !== id));
  };

  // Find user from allUser using sender ID
  const getSenderUser = (id) => {
    return allUser?.find((user) => user._id === id);
  };

  const handleAction = async (requestId, type) => {
    try {
      if (type === "accept") {
        await acceptFriendRequest(requestId);
        toast.success("Friend request accepted!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        await declineFriendRequest(requestId);
        toast.success("Friend request declined!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      }

      removeRequest(requestId);

    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Error:", err);
    }
  };

  return (
    <div className="notificatins-home">
      {notifications.length === 0 && <p>No new notifications</p>}

      {notifications.map((req) => {
        const user = getSenderUser(req.sender._id); // full user data here

        return (
          <div key={req._id} className="notification">

            {/* Correct Avatar */}
            <img
              src={user?.avatar || req.sender.avatar}
              alt={user?.username || "user"}
              className="notification-avatar"
            />

            <div className="notification-left">
              <p>
                <strong>{user?.username || req.sender.username}</strong> sent friend request
              </p>

              <div className="notification-right">

                <button
                  className="accept-btn"
                  onClick={() => handleAction(req.sender._id, "accept")}
                >
                  Accept
                </button>

                <button
                  className="reject-btn"
                  onClick={() => handleAction(req.sender._id, "reject")}
                >
                  Reject
                </button>

              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Notification;
