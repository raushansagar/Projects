import React, { useContext, useEffect, useRef } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import "./IncomingCallPopup.css";

export default function IncomingCallPopup({ callData, onAccept, onReject }) {
  const audioRef = useRef(null);
  const { allUser } = useContext(StoreContext);

  // Find caller user by ID
  const caller = allUser?.find((user) => user._id === callData?.callerId);

  // Unlock audio playback on first user interaction (required for autoplay policy)
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => { /* ignore errors */ });

      document.body.removeEventListener("click", unlockAudio);
      document.body.removeEventListener("keydown", unlockAudio);
    };

    document.body.addEventListener("click", unlockAudio);
    document.body.addEventListener("keydown", unlockAudio);

    return () => {
      document.body.removeEventListener("click", unlockAudio);
      document.body.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // Play ringtone on incoming call, stop when callData changes or cleared
  useEffect(() => {
    if (audioRef.current && callData) {
      audioRef.current.loop = true;
      audioRef.current.play().catch((e) => {
        console.log("Failed to play ringtone:", e);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [callData]);

  if (!callData) return null;

  return (
    <div className="incoming-call-popup">
      <div className="caller-info">
        <img
          className="caller-avatar"
          src={caller?.avatar || "/default-avatar.png"}
          alt={caller?.username || "Caller"}
        />
        <p className="caller-text">
          📞 Incoming call from <strong>{caller?.username || callData.callerId}</strong>
        </p>
      </div>

      <div className="call-actions">
        <button className="btn accept" onClick={onAccept}>Accept</button>
        <button className="btn reject" onClick={onReject}>Reject</button>
      </div>

      <audio
        ref={audioRef}
        src="/ringtone.mp3"
        preload="auto"
        style={{ display: "none" }}
      />
    </div>
  );
}
