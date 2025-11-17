import { asyncHandler } from '../utils/asyncHandler.js';
import { User, FriendRequest, Conversation, Message, Notification } from "../models/user.model.js";
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCoudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms from 'ms';





// register user
const registerUser = asyncHandler(async (req, res) => {
    let { username, email, password } = req.body;

    console.log(username, email, password);

    // Only check string fields
    if ([username, email, password].some(field => typeof field !== 'string' || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }


    const exitedUser = await User.findOne({
        $or: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
        ]
    });


    if (exitedUser) {
        throw new ApiError(400, "Email or Username already exists");
    }

    const avatarImg = await `https://avatar.iran.liara.run/username?username=${username}`;
    const profileImgLocalPath = req.files?.avatar?.[0]?.path;
    const profileImg = await uploadOnCoudinary(profileImgLocalPath);

    // create user data and store in database
    let user = await User.create({
        username: username,
        email: email,
        password: password,
        avatar: profileImg?.secure_url || avatarImg,
    })

    // generate refreshToken and accessToken
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });


    // updata details in database
    user = await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                lastSeen: new Date(),
                isOnline: true,
                refreshToken: refreshToken,
            }
        },
        {
            new: true
        }
    )


    // Set refreshToken in cookie (HttpOnly)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,  // set true in production with HTTPS
        sameSite: "strict",
        maxAge: 9 * 24 * 60 * 60 * 1000 
    });


    return res.status(201).json({
        "accessToken": accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        message: "User registered successfully",
    });
})




// login user
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);


    // check user in database
    let user = null;
    if (username || email) {
        user = await User.findOne({
            $or: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
            ]
        });
    }
    if (!user) {
        throw new ApiError(401, "Invalid username or email")
    }

    console.log(user)


    // check password 
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
        throw new ApiError(401, "Invalid password");
    }


    // generate refreshToken and accessToken
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });


    // updata details in database
    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                lastSeen: new Date(),
                isOnline: true,
                refreshToken: refreshToken,
            }
        },
        {
            new: true
        }
    )



    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict',
        maxAge: 9 * 24 * 60 * 60 * 1000     // 9 days in milliseconds
    });


    // login user
    const loginUser = await User.findById(user._id).select("-password -refreshToken");
    console.log("User login", loginUser);


    return res.status(200).json({
        "accessToken": accessToken,
        user: loginUser,
        message: "User logged in successfully"
    });
})



// logout user
const logoutUser = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;


    if (!token) return res.status(401).json({ message: "Unauthorized request" });
    let userId = null;

    // Decode token to get user id
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        userId = decoded?.id;
    } catch (err) {
        return res.status(401).json({ message: "Token Access Unauthorized request" });
    }

    // Set user offline and clear refreshToken
    await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: "" },
        $set:
        {
            isOnline: false,
            lastSeen: new Date()
        }
    });

    const user = await User.findById(userId).select("-password -refreshToken");
    console.log("User logged Out");

    res.clearCookie('refreshToken',
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });


    return res.status(200).json({ message: 'Logged out successfully' });
})



// Refresh AccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    console.log("RefreshToken Calling");

    // Check if refresh token exists
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized request: no refresh token" });
    }

    try {
        // Verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token - user not found" });
        }

        // Compare stored refresh token
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        // Update user in DB (save new refresh token + status)
        await User.findByIdAndUpdate(
            user._id,
            { $set: { lastSeen: new Date(), isOnline: true, refreshToken } },
            { new: true }
        );

        // Set refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)
        });


        // Send new access token
        return res.status(200).json({
            accessToken,
            message: "Access token refreshed successfully"
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
});




// fetch logged user // current user data
const fetchCurrentUser = asyncHandler(async (req, res, next) => {

    // req.user._id
    const userId = req.user._id;


    try {
        const user = await User.findById(userId).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json({
            user,
            message: "User fetched successfully"
        });
    } catch (err) {
        throw new ApiError(401, "Invalid or expired access token");
    }
});



// Fetch all users except the current logged-in user
const fetchAllUserData = asyncHandler(async (req, res) => {
    // Get current user ID from middleware
    const currentUserId = req.user._id;

    // Fetch all other users
    const users = await User.find({ _id: { $ne: currentUserId } })
        .select("-password -refreshToken") // exclude sensitive fields
        .sort({ createdAt: -1 }); // latest users first

    if (!users || users.length === 0) {
        throw new ApiError(404, "No other users found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "users",
            "All users fetched successfully (excluding current user)"
        )
    );
});




// Send Friend Request
const sendFriendRequest = asyncHandler(async (req, res) => {
    const { receiverId } = req.body;        // the user you want to send request to
    const senderId = req.user._id;          // logged-in user

    // 1️⃣ Cannot send request to self
    if (senderId.toString() === receiverId) {
        throw new ApiError(400, "You cannot send a request to yourself");
    }

    // 2️⃣ Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "Receiver not found");
    }

    // 3️⃣ Check if already friends
    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId)) {
        throw new ApiError(400, "You are already friends with this user");
    }

    // 4️⃣ Check for existing pending friend requests (both directions)
    const existing = await FriendRequest.findOne({
        $or: [
            { sender: senderId, receiver: receiverId, status: "pending" },
            { sender: receiverId, receiver: senderId, status: "pending" }
        ]
    });

    if (existing) {
        throw new ApiError(400, "Friend request already exists");
    }

    // 5️⃣ Create new friend request
    const newRequest = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
    });

    // 6️⃣ Optional: create notification for receiver
    await Notification.create({
        user: receiverId,
        type: "friend_request",
        message: `${sender.username} sent you a friend request`,
    });

    return res.status(201).json(
        new ApiResponse(201, newRequest, "Friend request sent successfully")
    );
});





// Accept Friend Request
const acceptFriendRequest = asyncHandler(async (req, res) => {
    const receiverId = req.user._id;
    const senderId = req.body.requestId;

    // check friendRequest exist or not
    // a to b
    let request = await FriendRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
    });
    // b to a
    if (!request) {
        request = await FriendRequest.findOne({
            sender: receiverId,
            receiver: senderId,
            status: "pending",
        });
    }
    if (!request) {
        throw new ApiError(404, "Friend request not found");
    }


    // check reciver user friend or not 
    const user = await User.findById(receiverId);
    if (user.friends.includes(receiverId)) {
        await FriendRequest.findByIdAndDelete(request._id);
        throw new ApiError(400, "You are already friends");
    }

    // update and find by id request 
    const updateRequest = await FriendRequest.findByIdAndUpdate(
        request._id,
        { $set: { status: "accepted" } },
        { new: true }
    );


    // Add each other as friends (prevent duplicates with $addToSet)
    await User.findByIdAndUpdate(receiverId, {
        $addToSet: { friends: senderId },
    });
    await User.findByIdAndUpdate(senderId, {
        $addToSet: { friends: receiverId },
    });

    // Create a conversation if it doesn't exist
    let conversation = await Conversation.findOne({
        participants: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [receiverId, senderId],
        });
    }

    // Notify sender about acceptance
    await Notification.create({
        user: senderId,
        type: "friend_accept",
        message: `accepted your friend request`,
    });

    return res.status(200).json(
        new ApiResponse(200, "Friend request accepted successfully")
    );
});




// Decline Friend Request

const declineFriendRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const userId = req.user._id;


    // 1️⃣ Find pending friend request where current user is receiver
    let request = await FriendRequest.findOne({
        sender: requestId,
        receiver: userId,
        status: "pending",
    });
    // b to a
    if (!request) {
        request = await FriendRequest.findOne({
            sender: userId,
            receiver: requestId,
            status: "pending",
        });
    }

    if (!request) {
        throw new ApiError(404, "Friend request not found or already handled");
    }

    // 2️⃣ Delete the friend request
    await FriendRequest.findByIdAndDelete(request._id);

    return res.status(200).json(
        new ApiResponse(200, "Friend request declined and deleted successfully")
    );
});




// get Pending Requests
const getPendingRequests = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
        receiver: userId,
        status: "pending"
    }).populate("sender", "username email");

    return res.status(200).json(
        new ApiResponse(200, requests, "Pending friend requests fetched successfully")
    );
});


//getFriends
const getFriends = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId)
        .populate("friends", "username email");

    return res.status(200).json(
        new ApiResponse(200, user.friends, "Friends list fetched successfully")
    );
});



// send a message
const sendMessage = asyncHandler(async (req, res) => {
    const { senderId, text } = req.body;
    const receiverId = req.user._id;

    if (!senderId || !text || !receiverId) {
        throw new ApiError(400, "All fields are required");
    }

    //  Check if a conversation already exists between these users
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    //  If no conversation, create a new one
    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            message: [], // <-- important fix (initialize message array)
        });
    }

    //  Create the message
    const newMessage = await Message.create({
        senderId: receiverId,
        receiverId: senderId,
        message: text,
    });

    //  Push new message into the conversation’s message array
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Return response
    return res
        .status(201)
        .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});


// get message 
const getMessages = asyncHandler(async (req, res) => {
    const otherPaticipantId = req.params.senderId;
    const myId = req.user._id;


    if (!otherPaticipantId || !myId) {
        throw new ApiError(400, "All Fields are required");
    }

    const conversation = await Conversation.findOne({
        participants: { $all: [myId, otherPaticipantId] },
    });
    const messageIds = conversation.message;

    const messages = await Message.find({ _id: { $in: conversation.messages } })
        .sort({ createdAt: 1 })
        .populate("senderId receiverId", "username email");


    return res.status(200).json(
        new ApiResponse(200, messages, "Messages fetched successfully")
    );
});


// ResetPassword
const ResetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required!");
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User not found with this email!");
  }

  // Update the password
  user.password = password;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful!"));
});



export {
    registerUser, loginUser, logoutUser, refreshAccessToken, acceptFriendRequest, getPendingRequests, declineFriendRequest,
    fetchCurrentUser, fetchAllUserData, sendFriendRequest, getFriends,
    sendMessage, getMessages, ResetPassword
};