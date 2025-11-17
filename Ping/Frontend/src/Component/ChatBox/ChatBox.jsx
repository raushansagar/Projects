import React, { useState, useEffect, useRef, useContext } from "react";
import { getMessages } from "../../Api/auth";
import "./ChatBox.css";
import { useSocket } from "../../Providers/Socket.jsx";
import { StoreContext } from "../../StoreContext/StoreContext.jsx";

const ChatBox = ({ data }) => {
  const { user } = useContext(StoreContext);
  const { incomingMessage, sendMessage } = useSocket() || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  if (!user) return null;
  if (!data) return <div className="fc-chat-placeholder">Select a user</div>;

  // Normalize message
  const normalizeMessage = (msg) => ({
    senderId: msg.senderId?._id || msg.senderId,
    receiverId: msg.receiverId?._id || msg.receiverId,
    message: msg.message,
    createdAt: msg.createdAt || new Date(),
  });

  // Load previous messages
  useEffect(() => {
    if (!data?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(data._id);

        const sorted = res?.data
          ?.map(normalizeMessage)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setMessages(sorted || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [data?._id]);

  // Handle incoming messages (REAL-TIME)
  useEffect(() => {
    if (!incomingMessage) return;
    if (!data?._id) return;

    const msg = normalizeMessage(incomingMessage);

    // Ignore echo message sent BACK to the sender
    if (msg.senderId === user._id) return;

    // Accept only messages related to this chat
    const isForThisChat =
      msg.senderId === data._id || msg.receiverId === data._id;

    if (isForThisChat) {
      setMessages((prev) => [...prev, msg]);
    }
  }, [incomingMessage, data?._id]);

  // Send message
  const handleSend = () => {
    if (!text.trim()) return;

    const newMsg = {
      senderId: user._id,
      receiverId: data._id,
      message: text,
      createdAt: new Date(),
    };

    // Add to UI instantly
    setMessages((prev) => [...prev, normalizeMessage(newMsg)]);

    // Emit to socket
    if (sendMessage) sendMessage(data._id, text);

    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fc-chat-container">
      <div className="fc-messages-box">
        {messages.map((msg, i) => {
          const isSender = msg.senderId === user._id;

          return (
            <div
              key={i}
              className={`fc-message ${isSender ? "fc-right" : "fc-left"}`}
            >
              <div className="fc-bubble">
                <p>{msg.message}</p>
                <span className="fc-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      <div className="fc-input-box">
        <input
          type="text"
          placeholder="Enter your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <ion-icon name="send-outline" onClick={handleSend}></ion-icon>
      </div>
    </div>
  );
};

export default ChatBox;
