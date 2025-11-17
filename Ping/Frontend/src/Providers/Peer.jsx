import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./Socket";

const PeerContext = createContext(null);
export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  const { socket, callTarget } = useSocket();  
  // callTarget = the userId you're calling or receiving from

  const peerRef = useRef(null);

  // React states
  const [localStreamState, setLocalStreamState] = useState(null);
  const [remoteStreamState, setRemoteStreamState] = useState(null);

  const localStream = useRef(null);

  // Create PeerConnection
  const createPeer = () => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ],
    });

    peerRef.current.ontrack = (event) => {
      setRemoteStreamState(event.streams[0]);
    };

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate && callTarget) {
        socket.emit("ice-candidate", {
          to: callTarget,
          candidate: event.candidate,
        });
      }
    };
  };

  // Start local media
  const getUserMediaStream = async () => {
    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStreamState(localStream.current);
    }
    return localStream.current;
  };

  // Caller creates offer
  const createOffer = useCallback(async () => {
    if (!peerRef.current) createPeer();

    const stream = await getUserMediaStream();
    stream.getTracks().forEach((track) =>
      peerRef.current.addTrack(track, stream)
    );

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    return offer;
  }, []);

  // Receiver creates answer
  const createAnswer = useCallback(async (offer) => {
    if (!peerRef.current) createPeer();

    const stream = await getUserMediaStream();
    stream.getTracks().forEach((track) =>
      peerRef.current.addTrack(track, stream)
    );

    await peerRef.current.setRemoteDescription(offer);

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    return answer;
  }, []);

  // Caller sets remote answer
  const setRemoteAnswer = useCallback(async (answer) => {
    if (!peerRef.current) createPeer();

    await peerRef.current.setRemoteDescription(answer);
  }, []);

  // Add ICE from remote
  const addIceCandidate = async (candidate) => {
    if (peerRef.current && candidate) {
      await peerRef.current.addIceCandidate(candidate);
    }
  };

  // Close & reset
  const closePeer = () => {
    try {
      if (localStream.current) {
        localStream.current.getTracks().forEach((t) => t.stop());
      }
      if (remoteStreamState) {
        remoteStreamState.getTracks().forEach((t) => t.stop());
      }
      peerRef.current?.close();
    } catch (e) {
      console.log("Close peer error:", e);
    }

    // reset
    localStream.current = null;
    setLocalStreamState(null);
    setRemoteStreamState(null);
    peerRef.current = null;
  };

  return (
    <PeerContext.Provider
      value={{
        // streams
        localStream: localStreamState,
        remoteStream: remoteStreamState,

        // methods
        createOffer,
        createAnswer,
        setRemoteAnswer,
        addIceCandidate,
        closePeer,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
