import { React, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom'
import "./Chat.css";
import ping from "../../assets/ping.png";
import { StoreContext } from "../../StoreContext/StoreContext";
import { fetchAllUser } from "../../Api/auth";
import Notification from "../Notification/Notification";
import Friend from "../Friend/Friend";
import FriendChatHeading from "../FriendChatHeading/FriendChatHeading";
import Home from "../Home/Home";
import ChatBox from "../ChatBox/ChatBox";

import {
  sendFriendRequest,
  getPendingRequests,
  declineFriendRequest,
  acceptFriendRequest,
} from "../../Api/auth";

import { toast } from "react-toastify";

const Chat = () => {
  const {
    user,
    login,
    setLogin,
    logout,
    allUser,
    conversation,
    notification,
    setNotification,
    pendingReq,
  } = useContext(StoreContext);

  const [setting, openSetting] = useState(false);
  const [headingDeatail, setHeadingDetail] = useState(null);

  const navigate = useNavigate();

  const clickFriend = (check) => {
    if (headingDeatail != null && check._id === headingDeatail._id) {
      setHeadingDetail(null);
    } else {
      setHeadingDetail(check);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredUsers([]);
      return;
    }

    const filtered = allUser.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  // send friend request
  const handleSendRequest = async (userId) => {
    try {
      const res = await sendFriendRequest(userId);

      toast.success(res.message || "Request sent successfully!", {
        position: "top-right",
        theme: "dark",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to send request", {
        position: "top-right",
        theme: "dark",
        autoClose: 2000,
      });
    }
  };

  // logout with toast
  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully", {
      position: "top-right",
      theme: "dark",
      autoClose: 2000,
    });
  };

  // fetch all users with toast (optional)
  const handleFetchUsers = async () => {
    try {
      await fetchAllUser();
      toast.success("Users refreshed", {
        position: "top-right",
        theme: "dark",
        autoClose: 1500,
      });
      navigate("/user/profile");
    } catch (err) {
      toast.error("Failed to refresh users", {
        position: "top-right",
        theme: "dark",
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="left-chat-box">
          <img src={ping} alt="Photo" />
          <div className="setting">
            {setting == true ? (
              <div className="perdon-or-logout">
                <ion-icon onClick={handleFetchUsers} name="person"></ion-icon>

                <ion-icon onClick={handleLogout} name="log-out"></ion-icon>
              </div>
            ) : (
              ""
            )}
            <ion-icon
              onClick={() => openSetting(!setting)}
              name="settings-sharp"
            ></ion-icon>
          </div>
        </div>

        <div className="center-chat-box">
          <div className="user-box">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <p>
                <ion-icon name="search-sharp"></ion-icon>
              </p>
            </div>

            {searchQuery && searchQuery.trim() !== "" && (
              <div className="search-show-box">
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user._id} className="search-item">
                      <span>{`@${user.username}`}</span>

                      <ion-icon
                        onClick={() => handleSendRequest(user._id)}
                        name="send"
                      ></ion-icon>
                    </div>
                  ))
                ) : (
                  <p>No users found</p>
                )}
              </div>
            )}

            {/* friend side bar */}
            <div className="all-friend-container">
              {allUser
                ?.filter((u) => user?.friends?.includes(u._id))
                .map((friend) => (
                  <div
                    key={friend._id}
                    onClick={() => clickFriend(friend)}
                  >
                    <Friend key={friend._id} req={friend} />
                  </div>
                ))}
            </div>
          </div>

          <hr />

          {headingDeatail ? (
            <div className="message-box">
              <div className="chat-heading">
                <FriendChatHeading data={headingDeatail} />
              </div>

              <ChatBox data={headingDeatail} />
            </div>
          ) : (
            <Home user={user} />
          )}

          <hr />

          <div className="slidebar">
            {notification ? (
              <Notification
                sender={pendingReq}
                onAccept={acceptFriendRequest}
                onReject={declineFriendRequest}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
