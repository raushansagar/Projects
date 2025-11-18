// backend/socket.server.js
import { User, FriendRequest, Conversation, Message, Notification } from "../models/user.model.js";
import dotenv from "dotenv";
import { app, express } from "../app.js";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

dotenv.config({ path: "../.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// online user store: userId -> socket.id
const onlineUsers = {};

// active call mapping: userId -> peerUserId
// When user A calls B successfully, we set:
// activeCalls[A] = B and activeCalls[B] = A
const activeCalls = {};

// VERIFY SOCKET USER (JWT in handshake auth)
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.warn("Socket auth failed: no token provided");
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    console.warn("Socket auth failed: invalid token", err.message);
    next(new Error("Invalid token"));
  }
});

// SOCKET CONNECTION
io.on("connection", (socket) => {
  const uid = socket.userId;
  console.log("Socket connected:", { socketId: socket.id, userId: uid });

  // join a room named by userId so we can emit with io.to(userId)
  try {
    socket.join(uid);
  } catch (err) {
    console.warn("Failed to join room for user:", uid, err);
  }

  // store online mapping (single socket per user)
  onlineUsers[uid] = socket.id;

  // broadcast online users to all clients
  io.emit("onlineUsers", Object.keys(onlineUsers));

  // -------------------------
  // CHAT: sendMessage handler
  // -------------------------
  socket.on("sendMessage", async ({ receiverId, message }) => {
    if (!receiverId || typeof message === "undefined") {
      console.warn("sendMessage missing fields", { receiverId, message });
      return;
    }

    const senderId = uid;

    try {
      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
          messages: [],
        });
      }

      // Create and save message document
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });

      // Push message id to conversation and save
      conversation.messages.push(newMessage._id);
      await conversation.save();

      // Prepare payload
      const payload = {
        _id: newMessage._id,
        senderId,
        receiverId,
        message,
        createdAt: newMessage.createdAt,
      };

      // Emit to receiver room (if they are online they'll be in their room)
      io.to(String(receiverId)).emit("receiveMessage", payload);

      // Emit to sender room so sender UI receives the message as well
      io.to(String(senderId)).emit("receiveMessage", payload);
    } catch (err) {
      console.error("Error in sendMessage handler:", err);
    }
  });

  // -------------------------
  // WebRTC Signaling
  // -------------------------

  // Caller initiates call -> forward offer to callee
  socket.on("call-user", ({ receiverId, offer }) => {
    if (!receiverId || !offer) {
      console.warn("call-user missing receiverId or offer", { receiverId, offer });
      return;
    }

    // Forward the offer to callee
    io.to(String(receiverId)).emit("call-made", { from: uid, offer });
    console.log(`call-user: ${uid} -> ${receiverId}`);

    // Don't mark activeCalls here yet. We only map when call is accepted
    // This avoids stale mapping if callee rejects or never answers.
    // If you prefer mapping on offer, uncomment below:
    // activeCalls[uid] = receiverId;
  });

  // Callee accepts -> send answer back to caller and mark active call
  socket.on("answer-call", ({ to, answer }) => {
    if (!to || !answer) {
      console.warn("answer-call missing 'to' or 'answer'", { to, answer });
      return;
    }

    // Notify caller
    io.to(String(to)).emit("call-accepted", { from: uid, answer });
    console.log(`answer-call: ${uid} -> ${to}`);

    // Mark both as in-call (active only after answer)
    activeCalls[uid] = to;
    activeCalls[to] = uid;
  });

  // Caller/peer may optionally send 'call-rejected' if they reject the incoming call
  socket.on("reject-call", ({ to }) => {
    if (!to) return;
    io.to(String(to)).emit("call-rejected", { from: uid });
    console.log(`reject-call: ${uid} -> ${to}`);
    // cleanup mapping if existed
    if (activeCalls[uid]) {
      const peer = activeCalls[uid];
      delete activeCalls[uid];
      delete activeCalls[peer];
    }
  });

  // ICE candidates exchange.
  // Accept either { to, candidate } or { candidate } and try to forward to active peer.
  socket.on("ice-candidate", ({ to, candidate }) => {
    if (!candidate) {
      console.warn("ice-candidate missing candidate");
      return;
    }

    // Prefer explicit 'to' if sent by client
    if (to) {
      io.to(String(to)).emit("ice-candidate", { from: uid, candidate });
      return;
    }

    // Otherwise, try to find peer from activeCalls mapping
    const peerId = activeCalls[uid];
    if (peerId) {
      io.to(String(peerId)).emit("ice-candidate", { from: uid, candidate });
    } else {
      // No mapping, try best-effort: log so you can debug client not sending 'to'
      console.warn("ice-candidate has no 'to' and no activeCalls mapping for", uid);
    }
  });

  // End-call: user intentionally ended call -> notify peer and cleanup
  socket.on("end-call", ({ to }) => {
    // If 'to' provided, use it; otherwise use activeCalls mapping
    const peerId = to || activeCalls[uid];

    if (peerId) {
      io.to(String(peerId)).emit("end-call", { from: uid });
      console.log(`end-call: ${uid} -> ${peerId}`);
    }

    // Cleanup mapping for both sides
    if (activeCalls[uid]) {
      const peer = activeCalls[uid];
      delete activeCalls[uid];
      delete activeCalls[peer];
    }
  });

  // -------------------------
  // DISCONNECT handler
  // -------------------------
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", { socketId: socket.id, userId: uid, reason });

    // If user was in a call, notify the peer and cleanup
    const peerId = activeCalls[uid];
    if (peerId) {
      io.to(String(peerId)).emit("end-call", { from: uid });
      delete activeCalls[peerId];
      delete activeCalls[uid];
    }

    // Remove user from onlineUsers only if the same socket id matches
    if (onlineUsers[uid] === socket.id) {
      delete onlineUsers[uid];
    }

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // Optional: handle explicit logout if you emit from client
  socket.on("logout", () => {
    // If user was in call, clean and notify peer
    const peerId = activeCalls[uid];
    if (peerId) {
      io.to(String(peerId)).emit("end-call", { from: uid });
      delete activeCalls[peerId];
      delete activeCalls[uid];
    }

    if (onlineUsers[uid]) delete onlineUsers[uid];
    socket.leave(uid);
    io.emit("onlineUsers", Object.keys(onlineUsers));
    console.log("User logged out and left:", uid);
  });
});

export { io, server, app, express };
