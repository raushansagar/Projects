import React, { useRef, useEffect, useState } from "react";
import { useSocket } from "../../Providers/Socket";
import "./VideoCall.css";

export default function VideoCall({ onClose }) {
  const { localStream, remoteStream, endCall } = useSocket();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // State to control mute/unmute
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  // Attach LOCAL stream immediately
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach REMOTE stream when available
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Toggle audio tracks enabled/disabled
  const toggleAudio = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
      track.enabled = audioMuted; // if muted, unmute; if unmuted, mute
    });
    setAudioMuted(!audioMuted);
  };

  // Toggle video tracks enabled/disabled
  const toggleVideo = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => {
      track.enabled = videoMuted; // if muted, unmute; if unmuted, mute
    });
    setVideoMuted(!videoMuted);
  };

  // End call handler
  const handleEndCall = () => {
    endCall();       // stop streams + peer cleanup
    if (onClose) onClose(); // close UI
  };

  return (
    <div className="video-call-wrapper">
      <div className="video-card">

        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="remote-video"
        />

        {/* Local Video */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="local-video"
        />

        {/* Controls */}
        <div className="call-controls">
          <button onClick={toggleAudio} className={`control-btn ${audioMuted ? "muted" : ""}`}>
            {audioMuted ? "Unmute Audio" : "Mute Audio"}
          </button>
          <button onClick={toggleVideo} className={`control-btn ${videoMuted ? "muted" : ""}`}>
            {videoMuted ? "Unmute Video" : "Mute Video"}
          </button>
          <button className="end-call" onClick={handleEndCall}>
            🔴 End Call
          </button>
        </div>

      </div>
    </div>
  );
}
