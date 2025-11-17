import Router from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    fetchCurrentUser, 
    fetchAllUserData, 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    getPendingRequests, 
    sendMessage,
    getMessages,
    ResetPassword
} from '../controllers/user.controler.js';
import { verifyOtp, sendOtp, sendWelcomeEmail} from '../utils/otpControler.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();



// ----------- User Route ----------

// user register route
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }
    ]),
    registerUser
);

// user login route
router.route("/login").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        }
    ]),
    loginUser
);


// logout user
router.route("/logout").post(verifyJWT, logoutUser);

// fetch current user
router.route("/fetchUser").post(verifyJWT, fetchCurrentUser);

// fetch all users
router.route("/fetchAllUser").post(verifyJWT, fetchAllUserData);

// refresh access token
router.route("/refreshToken").post( refreshAccessToken);


// ---------------- FRIEND ROUTES ----------------

// send friend request
router.route("/friends/request").post(verifyJWT, sendFriendRequest);

// accept friend request
router.route("/friends/accept").post(verifyJWT, acceptFriendRequest);

// decline friend request
router.route("/friends/decline").post(verifyJWT, declineFriendRequest);

// get all pending friend requests
router.route("/friends/requests").get(verifyJWT, getPendingRequests);



// ------------------------  MESSAGES  ------------------------------

// send message
router.route("/send/messages").post(verifyJWT, sendMessage)


// get all message 
router.route("/messages/:senderId").get(verifyJWT, getMessages);



// ------------------------- OTP ------------------------------

router.route("/send/otp").post(sendOtp);
router.route("/verify/otp").post(verifyOtp);


// --------------------- ResetPassword -------------------------

router.route("/ResetPassword").post(ResetPassword);
router.route("/sendWelcomeEmail").post(sendWelcomeEmail);

export { router };
