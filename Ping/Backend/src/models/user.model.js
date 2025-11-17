import mongoose, { Mongoose } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { Schema, Types } = mongoose;


// User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ""
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  statusMessage: {
    type: String,
    default: "Hey there! I am using Ping",
    maxlength: 100
  },
  refreshToken: {
    type: String,
    default: null
  },
  friends: [
    {
      type: Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });




// Friend Request Schema
const friendRequestSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      description: "User who sent the friend request",
    },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      description: "User who received the friend request",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
      description: "Current status of the friend request",
    },
  },
  { timestamps: true }
);


// Conversation Schema
const conversationSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
  },
  { timestamps: true }
);


const messageSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true,
  }
}, { timestamps: true })



// Notification Schema
const notificationSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  }, // who receives
  type: {
    type: String,
    enum: ["friend_request", "friend_accept"],
    required: true
  },
  message: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


// Otp Schema
const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 mins
});



// User Schema Methods
// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check password using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// Create and Export Models
const User = mongoose.model("User", userSchema);
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Otp = mongoose.model("Otp", otpSchema);


export { User, FriendRequest, Conversation, Message, Notification, Otp};