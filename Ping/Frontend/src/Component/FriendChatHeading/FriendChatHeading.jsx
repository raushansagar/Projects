import React, { useContext } from "react";
import "./FriendChatHeading.css";
import { StoreContext } from "../../StoreContext/StoreContext";
import { useSocket } from "../../Providers/Socket";

const FriendChatHeading = (data) => {

  const { notification, setNotification } = useContext(StoreContext);
  const { startVideoCall } = useSocket(); 


  return (
    <div className="friend-chat-heading-details">

      <div className="friend-imgae-name-details">
        <img src={data.data?.avatar} alt="avatar" />
        <div className="userName-Member">
          <h4>{data.data?.username}</h4>
          <p>2 Member</p>
        </div>
      </div>

      <div className="userDetailsIcon">
        <ion-icon name="search"></ion-icon>

        <ion-icon
          onClick={() => startVideoCall(data?.data?._id)}
          name="call"
        ></ion-icon>

        <ion-icon name="journal"></ion-icon>

        {/* Notification Toggle */}
        <ion-icon
          onClick={() => setNotification(!notification)}
          name="notifications"
        ></ion-icon>
      </div>
    </div>
  );
};

export default FriendChatHeading;
