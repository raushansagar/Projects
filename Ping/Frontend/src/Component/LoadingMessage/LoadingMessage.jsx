import React from "react";
import "./LoadingMessage.css";

const LoadingMessage = () => {
  return (
    <div className="loading-container">
      <div className="loading-logo">
        <span className="p">P</span>
        <span className="i">i</span>
        <span className="n">n</span>
        <span className="g">g</span>
        <div className="chat-icon">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
