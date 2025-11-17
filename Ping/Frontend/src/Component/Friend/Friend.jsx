import React, { useContext, useEffect } from "react";
import './Friend.css';
import { StoreContext } from "../../StoreContext/StoreContext";
import { useSocket } from "../../Providers/Socket";

const Friend = ({ req }) => {
  //const {onlineUsers, setOnlineUsers} = useContext(StoreContext);
  const { onlineUsers } = useSocket() || {};

  const username = req?.username;
  const avatar = req?.avatar;
  const isOnline = onlineUsers.includes(req._id);

  return (
    <div className="allUserFriend">
      <img src={avatar} alt="avatar" />
      <div className="profileFriend">
        <p>{username}</p>
        {isOnline ? <div className="online"></div> : ""}
      </div>
    </div>
  );
};

export default Friend;
