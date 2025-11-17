import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { io } from "socket.io-client";
import { StoreContext } from "../StoreContext/StoreContext";

const SocketContext = React.createContext(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useContext(StoreContext);
  const socketRef = useRef(null);

  const [incomingMessage, setIncomingMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const [incomingCall, setIncomingCall] = useState(null);
  const [callActive, setCallActive] = useState(false);

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [localStreamState, setLocalStreamState] = useState(null);
  const remoteStream = useRef(null);
  const [remoteStreamState, setRemoteStreamState] = useState(null);

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("⛔ No token → socket not connecting");
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io("http://localhost:8081", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setSocketConnected(false);
    });

    socket.on("onlineUsers", (users) => setOnlineUsers(users));
    socket.on("receiveMessage", (msg) => setIncomingMessage(msg));

    socket.on("call-made", ({ from, offer }) => {
      console.log("📞 Incoming call offer from:", from);
      setIncomingCall({ callerId: from, offer });
    });

    socket.on("call-accepted", async ({ from, answer }) => {
      console.log("📞 Call accepted by", from);
      if (!peerConnection.current) return;
      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Error setting remote description on call-accepted:", error);
      }
      setCallActive(true);
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      if (candidate && peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("ICE Error:", err);
        }
      }
    });

    socket.on("end-call", () => {
      console.log("📞 Call ended by remote user");
      endCall(false); // false = don't emit again, to avoid loop
    });

    socket.on("call-rejected", ({ from }) => {
      console.log("📞 Call rejected by", from);
      setIncomingCall(null);
    });
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("🔌 Manual socket disconnect");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log("👤 User logged in → connecting socket...");
      connectSocket();
    } else {
      console.log("🚪 User logged out → disconnecting socket...");
      disconnectSocket();
    }
  }, [user, connectSocket, disconnectSocket]);

  const sendMessage = (receiverId, message) => {
    if (!socketRef.current || !socketConnected) {
      console.error("❌ Cannot send: socket not connected");
      return;
    }
    socketRef.current.emit("sendMessage", { receiverId, message });
  };

  const prepareWebRTC = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStreamState(localStream.current);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    peerConnection.current.ontrack = (event) => {
      remoteStream.current = event.streams[0];
      setRemoteStreamState(remoteStream.current);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          to: peerConnection.current.target,
          candidate: event.candidate,
        });
      }
    };
  };

  const startVideoCall = async (receiverId) => {
    if (!socketRef.current) {
      console.error("❌ Socket not available for video call");
      return;
    }

    await prepareWebRTC();

    peerConnection.current.target = receiverId;

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socketRef.current.emit("call-user", {
      receiverId,
      offer,
    });
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    await prepareWebRTC();

    peerConnection.current.target = incomingCall.callerId;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socketRef.current.emit("answer-call", {
      to: incomingCall.callerId,
      answer,
    });

    setIncomingCall(null);
    setCallActive(true);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socketRef.current.emit("reject-call", { to: incomingCall.callerId });
    setIncomingCall(null);
  };

  // Add parameter emitEvent = true by default, when false it will NOT emit to other peer
  const endCall = (emitEvent = true) => {
    // Save target before closing peerConnection
    const targetId = peerConnection.current?.target;

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
      setLocalStreamState(null);
    }
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => track.stop());
      remoteStream.current = null;
      setRemoteStreamState(null);
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setCallActive(false);
    setIncomingCall(null);

    if (emitEvent && socketRef.current && targetId) {
      socketRef.current.emit("end-call", { to: targetId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        socketConnected,
        onlineUsers,
        incomingMessage,
        sendMessage,
        startVideoCall,
        localStream: localStreamState,
        remoteStream: remoteStreamState,
        incomingCall,
        acceptCall,
        rejectCall,
        callActive,
        endCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
